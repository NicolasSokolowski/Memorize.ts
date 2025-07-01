import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./card/cardSlice";
import userReducer from "./user/userSlice";
import { deckReducer } from "./deck/deckSlice";

const store = configureStore({
  reducer: {
    deck: deckReducer,
    card: cardReducer,
    user: userReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
