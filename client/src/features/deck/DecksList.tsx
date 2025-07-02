import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDecks } from "../../store/deck/deckThunk";
import DeckDetails from "./DeckDetails";

function DecksList() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);

  useEffect(() => {
    dispatch(getDecks());
  }, [dispatch]);

  return (
    <div className="h-full overflow-y-auto bg-primary p-12">
      <div className="flex h-full flex-wrap justify-start gap-12">
        {decks.map((deck) => (
          <DeckDetails key={deck.id} deck={deck} />
        ))}
        <div className="h-1 w-full" />
      </div>
    </div>
  );
}

export default DecksList;
