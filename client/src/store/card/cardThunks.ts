import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card } from "./cardSlice";
import axiosInstance from "../../services/axios.instance";

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
