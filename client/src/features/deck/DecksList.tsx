import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDecks } from "../../store/deck/deckThunk";
import DeckDetails from "./DeckDetails";
import DeckCreation from "./DeckCreation";
import { getAllCardsByUserEmail } from "../../store/card/cardThunks";
import { useOutletContext } from "react-router-dom";
import { Deck } from "../../store/deck/deckSlice";
import { sortDecks } from "../../helpers/sortDecks";

function DecksList() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);
  const hasBeenFetchedOnce = useAppSelector(
    (state) => state.deck.hasBeenFetchedOnce
  );

  const filteredItems = useOutletContext<Deck[]>() || decks;
  const sortedDecks = sortDecks(filteredItems);

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getDecks());
      dispatch(getAllCardsByUserEmail());
    }
  }, [dispatch, hasBeenFetchedOnce]);

  return (
    <div className="scrollbar-hide mt-14 overflow-y-auto bg-primary p-8 sm:mt-0">
      <div className="mb-8 grid grid-cols-[repeat(auto-fit,_15rem)] gap-8">
        <DeckCreation />
        {sortedDecks.map((deck) => (
          <DeckDetails key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DecksList;
