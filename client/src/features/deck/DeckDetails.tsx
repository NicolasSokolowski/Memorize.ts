import { Deck } from "../../store/deck/deckSlice";

interface DeckProps {
  deck: Deck;
}

function DeckDetails({ deck }: DeckProps) {
  return (
    <div className="flex size-60 justify-center rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-xl">
      <div className="flex h-[15%] w-full justify-center">
        <h3 className="font-patua text-xl text-textPrimary">{deck.name}</h3>
      </div>
    </div>
  );
}

export default DeckDetails;
