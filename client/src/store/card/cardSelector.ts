import { createSelector } from "reselect";
import { Card } from "./cardSlice";
import { RootState } from "../store";

const selectCards = (state: RootState) => state.card.cards;

export const selectCardsByDeckId = (deckId: number) =>
  createSelector([selectCards], (cards) =>
    cards.filter((card: Card) => card.deck_id === deckId)
  );
