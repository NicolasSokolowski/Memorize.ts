import { createSlice } from "@reduxjs/toolkit";

export interface User {
  email: string;
  password: string;
  username: string;
  role_id: number;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
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
  }
});

export const { setHasAccount } = userSlice.actions;

export default userSlice.reducer;
