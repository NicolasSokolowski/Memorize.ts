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
      <div className="grid grid-cols-5 gap-10 pb-8">
        {decks.map((deck) => (
          <DeckDetails key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DecksList;
