import { createSelector } from "reselect";
import { Card } from "./cardSlice";
import { RootState } from "../store";

const selectCards = (state: RootState) => state.card.cards;

export const selectCardsByDeckId = (deckId: number) =>
  createSelector([selectCards], (cards) =>
    cards.filter((card: Card) => card.deck_id === deckId)
  );

export const selectDailyCards = () =>
  createSelector([selectCards], (cards) =>
    cards.filter((card: Card) => card.next_occurrence === 0)
  );

export const selectHardCards = () =>
  createSelector([selectCards], (cards) =>
    cards.filter((card: Card) => card.difficulty <= 15)
  );
