import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card } from "./cardSlice";
import axiosInstance from "../../services/axios.instance";

export const getCards = createAsyncThunk<Card[], number>(
  "GET_CARDS",
  async (id) => {
    const response = await axiosInstance.get(`/decks/${id}/cards`);
    return response.data as Card[];
  }
);

export const createCard = createAsyncThunk<Card, Partial<Card>>(
  "CREATE_CARD",
  async (newCard: Partial<Card>) => {
    const response = await axiosInstance.post("/cards", newCard);
    return response.data as Card;
  }
);

export const updateCard = createAsyncThunk<Card, Partial<Card>>(
  "UPDATE_CARD",
  async (updatedCard: Partial<Card>) => {
    const response = await axiosInstance.put(
      `/cards/${updatedCard.id}`,
      updatedCard
    );
    return response.data as Card;
  }
);

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
