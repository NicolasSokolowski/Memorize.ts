import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios.instance";
import { Deck } from "./deckSlice";

export const getDecks = createAsyncThunk<Deck[]>("GET_DECKS", async () => {
  const response = await axiosInstance.get("/decks");
  return response.data as Deck[];
});
