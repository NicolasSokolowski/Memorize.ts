import { Deck } from "../../store/deck/deckSlice";

interface DeckProps {
  deck: Deck;
}

function DeckDetails({ deck }: DeckProps) {
  return (
    <div className="flex size-60 flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-xl">
      <div className="flex h-[15%] w-full px-2">
        <h3 className="w-full break-words text-center font-patua text-xl text-textPrimary">
          {deck.name}
        </h3>
      </div>
      <div className="flex h-16 w-full justify-between">
        <img src="/modification.png" alt="Modification icon" className="w-16" />
      </div>
    </div>
  );
}

export default DeckDetails;
