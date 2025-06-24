import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./card/cardSlice";
import userReducer from "./user/userSlice";

const store = configureStore({
  reducer: {
    card: cardReducer,
    user: userReducer
  }
});

export default store;
