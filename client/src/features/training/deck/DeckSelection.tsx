import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import DeckPicker from "./DeckPicker";
import { Link, useOutletContext } from "react-router-dom";
import { getDecks } from "../../../store/deck/deckThunk";
import { getAllCardsByUserEmail } from "../../../store/card/cardThunks";
import { Deck } from "../../../store/deck/deckSlice";

function DeckSelection() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);
  const hasBeenFetchedOnce = useAppSelector(
    (state) => state.deck.hasBeenFetchedOnce
  );

  const filteredItems = useOutletContext<Deck[]>() || decks;

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getDecks());
      dispatch(getAllCardsByUserEmail());
    }
  }, [dispatch, hasBeenFetchedOnce]);

  return (
    <div className="overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-12 pb-8">
        <Link
          to="/user/training/mode"
          className="flex size-60 flex-col items-center justify-center rounded-md bg-tertiary shadow-xl"
        >
          <span className="font-patua text-9xl text-secondary">&lt;</span>
        </Link>
        {filteredItems.map((deck) => (
          <DeckPicker key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DeckSelection;
