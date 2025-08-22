import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected
} from "@reduxjs/toolkit";
import {
  getCardsByDeckId,
  createCard,
  deleteCard,
  updateCard,
  updateCardsStats,
  getAllCardsByUserEmail
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
  reducers: {
    deleteCardsByDeckId: (state, action) => {
      state.cards = state.cards.filter(
        (card) => card.deck_id !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      // GET CARDS
      .addCase(getCardsByDeckId.fulfilled, (state, action) => {
        // Retrieve deck id sent as a parameter in the thunk
        const deckId = action.meta.arg;

        // Update cards without deleting other deck's cards
        state.cards = [
          ...state.cards.filter((card) => card.deck_id !== deckId),
          ...action.payload
        ];
      })
      // Create card
      .addCase(createCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
      })
      // Update card
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(
          (card) => card.id === action.payload.id
        );
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      // Delete card
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter((card) => card.id !== action.payload);
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
      })
      // Get all cards by user's email
      .addCase(getAllCardsByUserEmail.fulfilled, (state, action) => {
        state.cards = action.payload;
      })
      .addMatcher(
        isPending(
          getCardsByDeckId,
          createCard,
          updateCard,
          deleteCard,
          updateCardsStats,
          getAllCardsByUserEmail
        ),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isFulfilled(
          getCardsByDeckId,
          createCard,
          updateCard,
          deleteCard,
          updateCardsStats,
          getAllCardsByUserEmail
        ),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isRejected(
          getCardsByDeckId,
          createCard,
          updateCard,
          deleteCard,
          updateCardsStats,
          getAllCardsByUserEmail
        ),
        (state) => {
          state.isLoading = false;
        }
      );
  }
});

export const { deleteCardsByDeckId } = cardSlice.actions;
export default cardSlice.reducer;

export const getCards = (state: { card: CardState }) => state.card.cards;
