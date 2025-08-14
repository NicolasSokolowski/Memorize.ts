import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios.instance";
import { User } from "./userSlice";
import axios from "axios";

export type ApiError = {
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  errors: ApiError[];
};

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

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiErrorResponse }
>("USER_LOGOUT", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/profile/logout", {});
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export const deleteAccount = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiErrorResponse }
>("DELETE_USER", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.delete("/profile");
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

interface CheckEmail {
  newEmail: string;
}

export const checkIfEmailIsAvailable = createAsyncThunk<
  boolean,
  CheckEmail,
  { rejectValue: ApiErrorResponse }
>("CHECK_EMAIL", async ({ newEmail }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/users/email/check", {
      newEmail
    });
    return response.data.success;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

interface RequestCodeData {
  requestType: string;
  subject: string;
}

export const sendVerificationCode = createAsyncThunk<
  void,
  RequestCodeData,
  { rejectValue: ApiErrorResponse }
>("SEND_CODE", async ({ requestType, subject }, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/auth/code/send", { requestType, subject });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export type VerifyCodeData = {
  requestType: "EMAIL_CHANGE";
  code: string;
  data: { newEmail: string };
};

export const verifyCodeValidity = createAsyncThunk<
  string,
  VerifyCodeData,
  { rejectValue: ApiErrorResponse }
>("VERIFY_CODE", async ({ requestType, code, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/code/check", {
      requestType,
      code,
      data
    });

    return response.data.updatedUser.email ?? "";
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});
