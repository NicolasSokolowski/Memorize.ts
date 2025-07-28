import { useNavigate } from "react-router-dom";
import { Deck } from "../../store/deck/deckSlice";

export interface DeckProps {
  deck: Deck;
}

function DeckPicker({ deck }: DeckProps) {
  const navigate = useNavigate();

  return (
    <div className="flex size-60 flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-xl">
      <h3 className="w-full break-words text-center font-patua text-xl text-textPrimary">
        {deck.name}
      </h3>
      <div className="flex h-16 w-full justify-center">
        <img
          src="/training.png"
          alt="Training icon"
          className="w-16"
          draggable={false}
          onClick={() => navigate(`/training/decks/${deck.id}`)}
        />
      </div>
    </div>
  );
}

export default DeckPicker;
