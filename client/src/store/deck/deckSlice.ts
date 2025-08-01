import { createSlice } from "@reduxjs/toolkit";
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
      .addCase(getDecks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDecks.fulfilled, (state, action) => {
        state.decks = action.payload;
        state.hasBeenFetchedOnce = true;
        state.isLoading = false;
      })
      .addCase(getDecks.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to fetch decks");
      })
      // POST deck
      .addCase(createDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDeck.fulfilled, (state, action) => {
        state.decks.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createDeck.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed to create deck", action.error.message);
      })
      // PUT DECK
      .addCase(updateDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDeck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.decks = state.decks.map((deck) =>
          deck.id === action.payload.id ? action.payload : deck
        );
      })
      .addCase(updateDeck.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed to update deck", action.error.message);
      })
      // DELETE DECK
      .addCase(deleteDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDeck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.decks = state.decks.filter((deck) => deck.id !== action.payload);
      })
      .addCase(deleteDeck.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed at deleting deck", action.error.message);
      });
  }
});

export const deckReducer = deckSlice.reducer;
