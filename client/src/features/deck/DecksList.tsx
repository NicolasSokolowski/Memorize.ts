import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDecks } from "../../store/deck/deckThunk";
import DeckDetails from "./DeckDetails";
import DeckCreation from "./DeckCreation";

function DecksList() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);

  useEffect(() => {
    dispatch(getDecks());
  }, [dispatch]);

  return (
    <div className="h-full overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-14 pb-8">
        <DeckCreation />
        {decks.map((deck) => (
          <DeckDetails key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DecksList;
