import { Request, Response } from "express";
import { CardData } from "../datamappers/interfaces/CardDatamapperReq";
import { CoreController } from "./CoreController";
import { CardControllerReq } from "./interfaces/CardControllerReq";
import {
  AccessDeniedError,
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError
} from "../errors/index.errors";
import { userDatamapper } from "../datamappers/index.datamappers";
import { updateCardProgress } from "../helpers/index.helpers";

type CardUpdateRequest = {
  id: number;
  user_answer: string;
};

export class CardController extends CoreController<
  CardControllerReq,
  CardData
> {
  constructor(datamapper: CardControllerReq["datamapper"]) {
    const field = "front";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  getAllCardsByDeckId = async (req: Request, res: Response): Promise<void> => {
    const deckId = parseInt(req.params.deck_id, 10);

    const cards = await this.datamapper.findAllCardsByDeckId(deckId);

    if (!cards) {
      throw new NotFoundError("Cards not found", "CARDS_NOT_FOUND");
    }

    res.status(200).send(cards);
  };

  getAllCardsByUserEmail = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const userEmail = req.user?.email;

    const cards = await this.datamapper.findAllCardsByUserEmail(userEmail);
    const user = await userDatamapper.findBySpecificField("email", userEmail);

    if (!cards) {
      throw new NotFoundError("Cards not found", "CARDS_NOT_FOUND");
    }

    // Update cards last update field
    let shouldUpdateOccurrences = false;
    let diffInDays = 0;

    if (user.last_cards_update) {
      const today = new Date();
      const lastCardsUpdate = new Date(user.last_cards_update);

      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const lastCardsUpdateDate = new Date(
        lastCardsUpdate.getFullYear(),
        lastCardsUpdate.getMonth(),
        lastCardsUpdate.getDate()
      );

      const diff = todayDate.getTime() - lastCardsUpdateDate.getTime();
      diffInDays = diff > 0 ? Math.floor(diff / (1000 * 3600 * 24)) : 0;

      shouldUpdateOccurrences = diffInDays > 0;
    }

    if (shouldUpdateOccurrences) {
      const cards = await this.datamapper.findAllCardsByUserEmail(user.email);

      if (cards.length > 0) {
        for (const card of cards) {
          if (card.next_occurrence > 0) {
            card.next_occurrence = Math.max(
              0,
              card.next_occurrence - diffInDays
            );
          }

          if (card.next_occurrence === 0) {
            card.max_early = card.difficulty + 3;
          }
        }

        const updatedCards = await this.datamapper.updateCardsOccurrence(cards);

        if (!updatedCards) {
          throw new DatabaseConnectionError();
        }
      }
    }

    user.last_cards_update = new Date();
    const updatedUser = await userDatamapper.updateLastCardsUpdate(
      user.last_cards_update.toISOString(),
      user.email
    );

    if (!updatedUser) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(cards);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const deckId = parseInt(req.params.deck_id, 10);

    const checkIfExists = await this.datamapper.checkCompositeKey(
      data.front,
      deckId
    );

    data.deck_id = deckId;

    if (checkIfExists) {
      throw new BadRequestError(
        "front side already exists in this deck",
        "DUPLICATE_ENTRY",
        "front"
      );
    }

    const createdItem = await this.datamapper.insert(data);

    if (!createdItem) {
      throw new DatabaseConnectionError();
    }

    res.status(201).json(createdItem);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const cardId = parseInt(req.params.card_id, 10);
    const data: Partial<CardData> = req.body;

    if (!cardId) {
      throw new BadRequestError(
        "You should provide a valid id",
        "INVALID_PARAMETER"
      );
    }

    const card = await this.datamapper.findByPk(cardId);

    if (!card) {
      throw new NotFoundError("Card not found", "CARD_NOT_FOUND");
    }

    const checkIfCardExistsInDeck = await this.datamapper.checkCompositeKey(
      data.front,
      card.deck_id
    );

    if (checkIfCardExistsInDeck && checkIfCardExistsInDeck.id !== cardId) {
      throw new BadRequestError(
        "Front side already exists in this deck",
        "DUPLICATE_ENTRY",
        "front"
      );
    }

    const mergedData: CardData = {
      ...card,
      ...data,
      id: cardId
    };

    const updatedItem = await this.datamapper.update(mergedData);

    if (!updatedItem) {
      throw new DatabaseConnectionError();
    }

    const { created_at, updated_at, ...cardWithoutTimestamps } = updatedItem;

    res.status(200).json(cardWithoutTimestamps);
  };

  updateCardsDifficulty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const cards: CardUpdateRequest[] = req.body;
    const userEmail = req.user?.email;

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new BadRequestError(
        "The provided cards array must not be empty",
        "INVALID_DATA"
      );
    }

    const cardIds = cards.map((card) => card.id);

    if (cardIds.some((id) => typeof id !== "number" || isNaN(id))) {
      throw new BadRequestError(
        "Each card ID must be a valid number",
        "INVALID_DATA"
      );
    }

    const user = await userDatamapper.findBySpecificField("email", userEmail);

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    // Check if all cards belong to the user and return them if all of them do
    const allCardsBelongToUser = await this.datamapper.getUserCardsIfOwned(
      cardIds,
      user.id
    );

    if (!allCardsBelongToUser) {
      throw new AccessDeniedError(
        "Some cards are either not found or you don't have permission to access them"
      );
    }

    // Adding user answers property to the cards
    const cardsWithAnswers = allCardsBelongToUser.map((card) => {
      const update = cards.find((u) => u.id === card.id);
      return {
        ...card,
        user_answer: update?.user_answer
      };
    });

    // Handle the card difficulty depending on user's answer
    const cardsDifficultyRecalculated =
      await updateCardProgress(cardsWithAnswers);

    // Remove user_answer from the cards before updating
    const cardsToUpdate = cardsDifficultyRecalculated.map(
      ({ user_answer, ...card }) => card
    );

    const updatedCards =
      await this.datamapper.updateCardsDifficulty(cardsToUpdate);

    if (!updatedCards) {
      throw new DatabaseConnectionError();
    }

    res.status(200).json({ cards: updatedCards });
  };
}
