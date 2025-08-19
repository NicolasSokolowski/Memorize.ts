import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected
} from "@reduxjs/toolkit";
import { createDeck, deleteDeck, getDecks, updateDeck } from "./deckThunk";

export interface Deck {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface DeckState {
  decks: Deck[];
  isLoading: boolean;
  hasBeenFetchedOnce: boolean;
}

const initialState: DeckState = {
  decks: [],
  isLoading: false,
  hasBeenFetchedOnce: false
};

const deckSlice = createSlice({
  name: "deck",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET all decks
      .addCase(getDecks.fulfilled, (state, action) => {
        state.decks = action.payload;
        state.hasBeenFetchedOnce = true;
      })
      // POST deck
      .addCase(createDeck.fulfilled, (state, action) => {
        state.decks.push(action.payload);
      })
      // PUT DECK
      .addCase(updateDeck.fulfilled, (state, action) => {
        state.decks = state.decks.map((deck) =>
          deck.id === action.payload.id ? action.payload : deck
        );
      })
      // DELETE DECK
      .addCase(deleteDeck.fulfilled, (state, action) => {
        state.decks = state.decks.filter((deck) => deck.id !== action.payload);
      })
      .addMatcher(
        isPending(getDecks, createDeck, updateDeck, deleteDeck),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isFulfilled(getDecks, createDeck, updateDeck, deleteDeck),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isRejected(getDecks, createDeck, updateDeck, deleteDeck),
        (state, action) => {
          state.isLoading = false;
          console.error(action.error?.message);
        }
      );
  }
});

export const deckReducer = deckSlice.reducer;
