import { useNavigate } from "react-router-dom";
import { Deck } from "../../../store/deck/deckSlice";
import { useAppSelector } from "../../../store/hooks";
import { useMemo } from "react";
import { selectCardsByDeckId } from "../../../store/card/cardSelector";

export interface DeckProps {
  deck: Deck;
}

function DeckPicker({ deck }: DeckProps) {
  const selectDeckCards = useMemo(
    () => selectCardsByDeckId(deck.id),
    [deck.id]
  );
  const cards = useAppSelector(selectDeckCards);
  const navigate = useNavigate();

  return (
    <div className="flex size-60 animate-pop flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-custom-light">
      <h3 className="w-full break-words text-center font-patua text-xl text-textPrimary">
        {deck.name}
      </h3>
      <div className="flex h-16 w-full items-center justify-center">
        {cards.length > 0 ? (
          <img
            src="/training.png"
            alt="Training icon"
            className="w-16"
            draggable={false}
            onClick={() => navigate("/training", { state: { cards } })}
          />
        ) : (
          <span className="font-patua text-xl text-textPrimary">Deck vide</span>
        )}
      </div>
    </div>
  );
}

export default DeckPicker;
