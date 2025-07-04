import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios.instance";
import { Deck } from "./deckSlice";
import axios from "axios";

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

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

interface DeleteDeckResponse {
  success: boolean;
  message: string;
}

export const deleteDeck = createAsyncThunk<
  DeleteDeckResponse,
  number,
  { rejectValue: ApiErrorResponse }
>("DELETE_DECK", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/decks/${id}`);
    return response.data as DeleteDeckResponse;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});
