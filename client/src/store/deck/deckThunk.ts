import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios.instance";
import { Deck } from "./deckSlice";

export const getDecks = createAsyncThunk<Deck[]>("GET_DECKS", async () => {
  const response = await axiosInstance.get("/decks");
  return response.data as Deck[];
});

export const createDeck = createAsyncThunk<Deck, Partial<Deck>>(
  "CREATE_DECK",
  async (newDeck: Partial<Deck>) => {
    const response = await axiosInstance.post("/decks", newDeck);
    return response.data as Deck;
  }
);
