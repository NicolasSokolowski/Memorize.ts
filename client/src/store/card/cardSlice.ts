import { createSlice } from "@reduxjs/toolkit";
import {
  getCardsByDeckId,
  createCard,
  deleteCard,
  updateCard,
  updateCardsStats
} from "./cardThunks";

export interface Card {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  difficulty: number;
  win_streak: number;
  max_early: number;
  next_occurrence: number;
  created_at: Date;
  updated_at: Date;
}

interface CardState {
  cards: Card[];
  isLoading: boolean;
}

const initialState: CardState = {
  cards: [],
  isLoading: false
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET CARDS
      .addCase(getCardsByDeckId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCardsByDeckId.fulfilled, (state, action) => {
        // Retrieve deck id sent as a parameter in the thunk
        const deckId = action.meta.arg;

        // Update cards without deleting other deck's cards
        state.cards = [
          ...state.cards.filter((card) => card.deck_id !== deckId),
          ...action.payload
        ];

        state.isLoading = false;
      })
      .addCase(createCard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createCard.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed to create card:", action.error.message);
      })
      .addCase(updateCard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(
          (card) => card.id === action.payload.id
        );
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateCard.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed to update card:", action.error.message);
      })
      .addCase(deleteCard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(
          (card) => card.id !== action.payload.id
        );
        state.isLoading = false;
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed to delete card:", action.error.message);
      })
      .addCase(updateCardsStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCardsStats.fulfilled, (state, action) => {
        action.payload.forEach((updatedCard) => {
          const index = state.cards.findIndex(
            (card) => card.id === updatedCard.id
          );
          if (index !== -1) {
            state.cards[index] = updatedCard;
          } else {
            state.cards.push(updatedCard);
          }
        });
        state.isLoading = false;
      })
      .addCase(updateCardsStats.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed to update cards stats:", action.error.message);
      });
  }
});

export default cardSlice.reducer;

export const getCards = (state: { card: CardState }) => state.card.cards;
