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

    if (!entity) {
      return next();
    }

    try {
      switch (entity) {
        case "deck":
          const deck_id = req.params.deck_id;

          if (!deck_id || isNaN(parseInt(deck_id, 10))) {
            throw new BadRequestError("Invalid deck ID provided.");
          }

          const deck = await deckDatamapper.findByPk(parseInt(deck_id, 10));

          if (!deck) {
            throw new NotFoundError();
          }

          const deckUser = await userDatamapper.findBySpecificField(
            "email",
            userEmail
          );

          if (deck.user_id !== deckUser.id) {
            throw new AccessDeniedError("You do not own this deck.");
          }
          break;

        case "card":
          const card_id = req.params.card_id;

          if (!card_id || isNaN(parseInt(card_id, 10))) {
            throw new BadRequestError("Invalid card ID provided.");
          }

          const cardUser = await cardDatamapper.findCardUserByCardId(
            parseInt(card_id, 10)
          );

          if (!cardUser) {
            throw new NotFoundError();
          }

          if (cardUser.email !== userEmail) {
            throw new AccessDeniedError("You do not own this card.");
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
