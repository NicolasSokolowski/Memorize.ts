import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios.instance";
import { User } from "./userSlice";
import axios from "axios";

export type ApiError = {
  field?: string;
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

export type RequestCodeData =
  | {
      requestType: "PASSWORD_RESET";
      subject: string;
      data: { email: string };
    }
  | {
      requestType: string;
      subject: string;
    };

function isPasswordReset(
  payload: RequestCodeData
): payload is Extract<RequestCodeData, { requestType: "PASSWORD_RESET" }> {
  return payload.requestType === "PASSWORD_RESET";
}

export const sendVerificationCode = createAsyncThunk<
  void,
  RequestCodeData,
  { rejectValue: ApiErrorResponse }
>("SEND_CODE", async (payload, { rejectWithValue }) => {
  try {
    let data: { requestType: string; subject: string; email?: string };
    const path =
      payload.requestType === "PASSWORD_RESET" ? "send/reset" : "send";

    if (isPasswordReset(payload)) {
      data = {
        requestType: payload.requestType,
        subject: payload.subject,
        email: payload.data.email
      };
    } else {
      data = {
        requestType: payload.requestType,
        subject: payload.subject
      };
    }

    await axiosInstance.post(`/auth/code/${path}`, data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});

export type VerifyCodeData =
  | {
      requestType: "EMAIL_CHANGE";
      code: string;
      data: { newEmail: string };
    }
  | {
      requestType: "ACCOUNT_DELETE";
      code: string;
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      data?: {};
    }
  | {
      requestType: "PASSWORD_RESET";
      code: string;
      data: { email: string };
    };

type VerifyCodeResponse = { email: string } | { success: true };

export const verifyCodeValidity = createAsyncThunk<
  VerifyCodeResponse,
  VerifyCodeData,
  { rejectValue: ApiErrorResponse }
>("VERIFY_CODE", async ({ requestType, code, data }, { rejectWithValue }) => {
  const path = requestType === "PASSWORD_RESET" ? "check/reset" : "check";

  try {
    const response = await axiosInstance.post(`/auth/code/${path}`, {
      requestType,
      code,
      data
    });

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data);
    }
    throw err;
  }
});
