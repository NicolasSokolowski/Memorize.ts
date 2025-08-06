import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios.instance";
import { User } from "./userSlice";
import { ApiErrorResponse } from "../../helpers/interfaces";
import axios from "axios";

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: ApiErrorResponse }
>("USER_LOGIN", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/profile", {
      email,
      password
    });
    return response.data.user as User;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export const getProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiErrorResponse }
>("GET_PROFILE", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/profile");
    return response.data.user as User;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export const updateUserInfos = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: ApiErrorResponse }
>("UPDATE_USER", async (userInfo: Partial<User>, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch("/profile", userInfo);
    return response.data.user as User;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export const logout = createAsyncThunk(
  "USER_LOGOUT",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/profile/logout", {});
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        return rejectWithValue(err.response.data);
      }
      throw err;
    }
  }
);
