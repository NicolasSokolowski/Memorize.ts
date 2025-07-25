import { useEffect } from "react";
import { getDecks } from "../../store/deck/deckThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import DeckPicker from "./DeckPicker";

function DeckSelection() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);

  useEffect(() => {
    dispatch(getDecks());
  }, [dispatch]);

  return (
    <div className="h-full overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-12 pb-8">
        {decks.map((deck) => (
          <DeckPicker key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DeckSelection;
