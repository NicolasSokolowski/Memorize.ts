import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected
} from "@reduxjs/toolkit";
import {
  checkIfEmailIsAvailable,
  deleteAccount,
  getProfile,
  login,
  logout,
  sendVerificationCode,
  updateUserInfos,
  verifyCodeValidity
} from "./userThunk";
import { REHYDRATE } from "redux-persist";

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
  isAuthenticated: boolean;
  lastPath?: string;
}

const initialState: UserState = {
  user: null,
  isLoading: true,
  hasAccount: false,
  isAuthenticated: false,
  lastPath: undefined
};

interface RehydrateAction<T> {
  type: string;
  payload?: T;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setHasAccount: (state, action) => {
      state.hasAccount = action.payload;
    },
    setUserNull: (state) => {
      state.user = null;
    },
    setLastPath(state, action) {
      state.lastPath = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.user = null;
      })
      .addCase(updateUserInfos.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyCodeValidity.fulfilled, (state, action) => {
        if ("email" in action.payload) {
          // EMAIL_CHANGE
          state.user!.email = action.payload.email;
        }
      })
      .addCase(REHYDRATE, (state, action: RehydrateAction<UserState>) => {
        if (action.payload?.user) {
          state.isAuthenticated = true;
        }
      })
      .addMatcher(
        isPending(
          login,
          getProfile,
          updateUserInfos,
          logout,
          deleteAccount,
          checkIfEmailIsAvailable,
          sendVerificationCode,
          verifyCodeValidity
        ),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isFulfilled(
          login,
          getProfile,
          updateUserInfos,
          logout,
          deleteAccount,
          checkIfEmailIsAvailable,
          sendVerificationCode,
          verifyCodeValidity
        ),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isRejected(
          login,
          getProfile,
          updateUserInfos,
          logout,
          deleteAccount,
          checkIfEmailIsAvailable,
          sendVerificationCode,
          verifyCodeValidity
        ),
        (state) => {
          state.isLoading = false;
        }
      );
  }
});

export const { setHasAccount, setUserNull, setLastPath } = userSlice.actions;

export default userSlice.reducer;
