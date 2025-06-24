import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Card {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  difficulty: number;
  win_streak: number;
  max_early: number;
  next_occurrence: number;
  created_at: string;
  updated_at: string;
}

interface CardState {
  cards: Card[];
}

const initialState: CardState = {
  cards: []
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    addCard(state, action: PayloadAction<Card>) {
      state.cards.push(action.payload);
    },
    updateCard(state, action: PayloadAction<Card>) {
      const index = state.cards.findIndex(
        (card: Card) => card.id === action.payload.id
      );
      if (index !== -1) {
        state.cards[index] = action.payload;
      }
    },
    updateCardsStats(state, action: PayloadAction<Card[]>) {
      action.payload.forEach((card: Card) => {
        const index = state.cards.findIndex((c: Card) => c.id === card.id);
        if (index !== -1) {
          state.cards[index] = card;
        } else {
          state.cards.push(card);
        }
      });
    },
    deleteCard(state, action: PayloadAction<Card>) {
      state.cards = state.cards.filter(
        (card: Card) => card.id !== action.payload.id
      );
    },
    setCards(state, action: PayloadAction<Card[]>) {
      state.cards = action.payload;
    }
  }
});

export const { addCard, updateCard, updateCardsStats, deleteCard, setCards } =
  cardSlice.actions;

export default cardSlice.reducer;
export const getCards = (state: { card: CardState }) => state.card.cards;
