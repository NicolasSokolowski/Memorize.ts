import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios.instance";
import { Deck } from "./deckSlice";
import axios from "axios";
import { ApiErrorResponse } from "../../types/api";
import { deleteCardsByDeckId } from "../card/cardSlice";

export const getDecks = createAsyncThunk<Deck[]>("GET_DECKS", async () => {
  const response = await axiosInstance.get("/decks");
  return response.data as Deck[];
});

export const createDeck = createAsyncThunk<
  Deck,
  Partial<Deck>,
  { rejectValue: ApiErrorResponse }
>("CREATE_DECK", async (newDeck: Partial<Deck>, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/decks", newDeck);
    return response.data as Deck;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

interface UpdateDeckPayload {
  id: number;
  data: Partial<Omit<Deck, "id">>;
}

export const updateDeck = createAsyncThunk<
  Deck,
  UpdateDeckPayload,
  { rejectValue: ApiErrorResponse }
>("UPDATE_DECK", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/decks/${id}`, data);
    return response.data as Deck;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export const deleteDeck = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiErrorResponse }
>("DELETE_DECK", async (id, { dispatch, rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/decks/${id}`);
    dispatch(deleteCardsByDeckId(id));
    return id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});
