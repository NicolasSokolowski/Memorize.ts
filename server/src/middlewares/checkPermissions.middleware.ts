/* eslint-disable no-case-declarations */
import { Request, Response, NextFunction } from "express";
import { AccessDeniedError } from "../errors/AccessDeniedError.error";
import { NotFoundError } from "../errors/NotFoundError.error";
import {
  cardDatamapper,
  deckDatamapper,
  userDatamapper
} from "../datamappers/index.datamappers";
import { UserPayload } from "../helpers/UserPayload.helper";
import { BadRequestError } from "../errors/BadRequestError.error";

declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}

export const checkPermissions = (permissions: string[], entity?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userEmail = req.user?.email;

    if (!userRole || !permissions.includes(userRole!)) {
      throw new AccessDeniedError("Not enough permissions");
    }

    const user = await userDatamapper.findBySpecificField("email", userEmail);

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    if (!entity) {
      return next();
    }

    try {
      switch (entity) {
        case "deck":
          const deck_id = req.params.deck_id;

          if (!deck_id || isNaN(parseInt(deck_id, 10))) {
            throw new BadRequestError(
              "Invalid deck ID provided.",
              "INVALID_PARAMETER"
            );
          }

          const deck = await deckDatamapper.findByPk(parseInt(deck_id, 10));

          if (!deck) {
            throw new NotFoundError("Deck not found", "DECK_NOT_FOUND");
          }

          if (deck.user_id !== user.id) {
            throw new AccessDeniedError("You do not own this deck");
          }
          break;

        case "card":
          const deckId = req.params.deck_id;

          if (!deckId || isNaN(parseInt(deckId, 10))) {
            throw new BadRequestError(
              "Invalid deck ID provided.",
              "INVALID_ID"
            );
          }

          const cardDeck = await deckDatamapper.findByPk(parseInt(deckId, 10));

          if (!cardDeck) {
            throw new NotFoundError("Deck not found", "DECK_NOT_FOUND");
          }

          if (user.id !== cardDeck.user_id) {
            throw new AccessDeniedError("You do not own this deck");
          }

          const card_id = req.params.card_id;

          if (!card_id || isNaN(parseInt(card_id, 10))) {
            throw new BadRequestError(
              "Invalid card ID provided",
              "INVALID_PARAMETER"
            );
          }

          const cardUser = await cardDatamapper.findCardUserByCardId(
            parseInt(card_id, 10)
          );

          if (!cardUser) {
            throw new NotFoundError("Card not found", "CARD_NOT_FOUND");
          }

          if (cardUser.email !== userEmail) {
            throw new AccessDeniedError("You do not own this card");
          }
          break;

        default:
          throw new AccessDeniedError("Invalid entity");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
