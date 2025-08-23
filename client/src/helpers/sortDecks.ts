import { Deck } from "../store/deck/deckSlice";
import store from "../store/store";

export function sortDecks(filteredDecks: Deck[]) {
  const cards = store.getState().card.cards;

  return [...filteredDecks].sort((a, b) => {
    const aCount = cards.filter((c) => c.deck_id === a.id).length;
    const bCount = cards.filter((c) => c.deck_id === b.id).length;

    if (aCount > 0 && bCount === 0) return -1;
    if (aCount === 0 && bCount > 0) return 1;

    if (aCount !== bCount) return bCount - aCount;

    return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  });
}
