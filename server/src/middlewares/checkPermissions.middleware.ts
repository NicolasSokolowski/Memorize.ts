/* eslint-disable no-case-declarations */
import { Request, Response, NextFunction } from "express";
import { AccessDeniedError } from "../errors/AccessDeniedError.error";
import { NotFoundError } from "../errors/NotFoundError.error";
import {
  cardDatamapper,
  deckDatamapper,
} from "../datamappers/index.datamappers";
import { UserPayload } from "../helpers/UserPayload.helper";

declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}

export const checkPermissions = (permissions: string[], entity?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (!userRole || !permissions.includes(userRole!)) {
      throw new AccessDeniedError("Not enough permissions");
    }

    if (!entity) {
      return next();
    }

    try {
      switch (entity) {
        case "deck":
          if (
            req.params.deck_id &&
            req.body.deck_id &&
            req.params.deck_id !== req.body.deck_id
          ) {
            throw new AccessDeniedError("Please provide valid data");
          }

          const deck_id = req.params.deck_id || req.body.deck_id;

          if (!deck_id) {
            throw new NotFoundError();
          }

          const deck = await deckDatamapper.findByPk(parseInt(deck_id, 10));

          if (!deck) {
            throw new NotFoundError();
          }

          if (deck.user_id !== userId) {
            throw new AccessDeniedError("You do not own this deck.");
          }
          break;

        case "card":
          const card_id = req.params.card_id;

          if (!card_id) {
            throw new NotFoundError();
          }

          const card = await cardDatamapper.findByPk(parseInt(card_id, 10));

          if (!card) {
            throw new NotFoundError();
          }

          const cardDeck = await deckDatamapper.findByPk(card.deck_id);

          if (!cardDeck) {
            throw new NotFoundError();
          }

          if (cardDeck.user_id !== userId) {
            throw new AccessDeniedError("You do not own this card.");
          }
          break;

        case "user":
          const user_id = req.params.user_id || req.body.user_id;

          if (
            req.params.user_id &&
            req.body.user_id &&
            req.params.user_id !== req.body.user_id
          ) {
            throw new AccessDeniedError("Please provide valid data");
          }

          if (!user_id) {
            throw new NotFoundError();
          }

          if (parseInt(user_id, 10) !== userId) {
            throw new AccessDeniedError("You can only access your data.");
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
