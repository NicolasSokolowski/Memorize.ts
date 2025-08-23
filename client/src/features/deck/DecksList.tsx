import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDecks } from "../../store/deck/deckThunk";
import DeckDetails from "./DeckDetails";
import DeckCreation from "./DeckCreation";
import { getAllCardsByUserEmail } from "../../store/card/cardThunks";
import { useOutletContext } from "react-router-dom";
import { Deck } from "../../store/deck/deckSlice";

function DecksList() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);
  const hasBeenFetchedOnce = useAppSelector(
    (state) => state.deck.hasBeenFetchedOnce
  );

  const cards = useAppSelector((state) => state.card.cards);

  const filteredItems = useOutletContext<Deck[]>() || decks;

  const sortedDecks = [...filteredItems].sort((a, b) => {
    const aCount = cards.filter((c) => c.deck_id === a.id).length;
    const bCount = cards.filter((c) => c.deck_id === b.id).length;

    if (aCount > 0 && bCount === 0) return -1;
    if (aCount === 0 && bCount > 0) return 1;

    if (aCount !== bCount) return bCount - aCount;

    return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  });

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getDecks());
      dispatch(getAllCardsByUserEmail());
    }
  }, [dispatch, hasBeenFetchedOnce]);

  return (
    <div className="scrollbar-hide h-full overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-12 pb-8">
        <DeckCreation />
        {sortedDecks.map((deck) => (
          <DeckDetails key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DecksList;
