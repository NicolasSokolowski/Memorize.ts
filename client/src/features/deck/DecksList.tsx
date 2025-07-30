import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDecks } from "../../store/deck/deckThunk";
import DeckDetails from "./DeckDetails";
import DeckCreation from "./DeckCreation";
import { getAllCardsByUserEmail } from "../../store/card/cardThunks";

function DecksList() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);
  const hasBeenFetchedOnce = useAppSelector(
    (state) => state.deck.hasBeenFetchedOnce
  );

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getDecks());
      dispatch(getAllCardsByUserEmail());
    }
  }, [dispatch, hasBeenFetchedOnce]);

  return (
    <div className="h-full overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-12 pb-8">
        <DeckCreation />
        {decks.map((deck) => (
          <DeckDetails key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DecksList;
