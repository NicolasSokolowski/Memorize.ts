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
