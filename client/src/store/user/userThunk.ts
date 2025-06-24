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

export const register = createAsyncThunk<
  User,
  { email: string; password: string; username: string }
>("USER_REGISTER", async ({ email, password, username }) => {
  const response = await axiosInstance.post("/users", {
    email,
    password,
    username
  });
  return response.data as User;
});
