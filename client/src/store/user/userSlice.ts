import { createSlice } from "@reduxjs/toolkit";
import {
  deleteAccount,
  getProfile,
  login,
  logout,
  updateUserInfos
} from "./userThunk";

export interface User {
  email: string;
  password: string;
  username: string;
  role_id: number;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date | null;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  hasAccount?: boolean;
  hasBeenFetchedOnce: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  hasAccount: false,
  hasBeenFetchedOnce: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setHasAccount: (state, action) => {
      state.hasAccount = action.payload;
    },
    setUserNull: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.hasBeenFetchedOnce = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.hasBeenFetchedOnce = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(updateUserInfos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserInfos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserInfos.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAccount.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setHasAccount, setUserNull } = userSlice.actions;

export default userSlice.reducer;
