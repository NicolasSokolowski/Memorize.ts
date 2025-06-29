import { createSlice } from "@reduxjs/toolkit";
import { login } from "./userThunk";

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
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  hasAccount: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setHasAccount: (state, action) => {
      state.hasAccount = action.payload;
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
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  }
});

export const { setHasAccount } = userSlice.actions;

export default userSlice.reducer;
