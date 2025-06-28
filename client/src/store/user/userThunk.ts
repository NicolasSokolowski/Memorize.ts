import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./userSlice";
import axiosInstance from "../../services/axios.instance";

export const login = createAsyncThunk<
  User,
  { email: string; password: string }
>("USER_LOGIN", async ({ email, password }) => {
  const response = await axiosInstance.post("/profile", {
    email,
    password
  });
  return response.data as User;
});
