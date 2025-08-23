import DeckPicker from "./DeckPicker";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { Deck } from "../../../store/deck/deckSlice";
import { useMemo } from "react";
import { sortDecks } from "../../../helpers/sortDecks";

interface LocationState {
  decks: Deck[];
}

function DeckSelection() {
  const location = useLocation();
  const state = location.state as LocationState;
  const decks = useMemo(() => state?.decks ?? [], [state?.decks]);

  const filteredItems = useOutletContext<Deck[]>() || decks;
  const sortedDecks = sortDecks(filteredItems);

  return (
    <div className="scrollbar-hide overflow-y-auto bg-primary p-8">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-8">
        <Link
          to="/user/training/mode"
          className="flex size-60 flex-col items-center justify-center rounded-md bg-tertiary shadow-custom-light"
        >
          <span className="font-patua text-9xl text-secondary">&lt;</span>
        </Link>
        {sortedDecks.map((deck) => (
          <DeckPicker key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DeckSelection;
