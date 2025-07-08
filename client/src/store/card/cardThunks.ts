import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card } from "./cardSlice";
import axiosInstance from "../../services/axios.instance";
import axios from "axios";

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

export const getCardsByDeckId = createAsyncThunk<Card[], number>(
  "GET_CARDS",
  async (id) => {
    const response = await axiosInstance.get(`/decks/${id}/cards`);
    return response.data as Card[];
  }
);

// Card creation thunk

interface CreateCardPayload {
  deckId: number;
  data: Partial<Card>;
}

export const createCard = createAsyncThunk<
  Card,
  CreateCardPayload,
  { rejectValue: ApiErrorResponse }
>("CREATE_CARD", async ({ deckId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/decks/${deckId}/cards`, data);
    return response.data as Card;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

interface UpdateCardPayload {
  deckId: number;
  cardId: number;
  data: Partial<Card>;
}

export const updateCard = createAsyncThunk<
  Card,
  UpdateCardPayload,
  { rejectValue: ApiErrorResponse }
>("UPDATE_CARD", async ({ deckId, cardId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      `/decks/${deckId}/cards/${cardId}`,
      data
    );
    return response.data as Card;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export const updateCardsStats = createAsyncThunk<Card[], Card[]>(
  "UPDATE_CARDS_STATS",
  async (cards: Card[]) => {
    const response = await axiosInstance.patch("/me/cards", cards);
    return response.data as Card[];
  }
);

export const deleteCard = createAsyncThunk<Card, Card>(
  "DELETE_CARD",
  async (card: Card) => {
    const response = await axiosInstance.delete(`/cards/${card.id}`);
    return response.data as Card;
  }
);
