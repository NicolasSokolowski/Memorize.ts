import { useAppSelector } from "../../store/hooks";
import DeckPicker from "./DeckPicker";
import { Link } from "react-router-dom";

function DeckSelection() {
  const decks = useAppSelector((state) => state.deck.decks);

  return (
    <div className="h-full overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-12 pb-8">
        <Link
          to="/user/training/mode"
          className="flex size-60 flex-col items-center justify-center rounded-md bg-tertiary shadow-xl"
        >
          <span className="font-patua text-9xl text-secondary">&lt;</span>
        </Link>
        {decks.map((deck) => (
          <DeckPicker key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DeckSelection;
