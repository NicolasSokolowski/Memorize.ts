import { createSlice } from "@reduxjs/toolkit";
import { getDecks } from "./deckThunk";

export interface Deck {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface DeckState {
  decks: Deck[];
  isLoading: boolean;
}

const initialState: DeckState = {
  decks: [],
  isLoading: false
};

const deckSlice = createSlice({
  name: "deck",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDecks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDecks.fulfilled, (state, action) => {
        state.decks = action.payload;
        state.isLoading = false;
      })
      .addCase(getDecks.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to fetch decks");
      });
  }
});

export const deckReducer = deckSlice.reducer;
