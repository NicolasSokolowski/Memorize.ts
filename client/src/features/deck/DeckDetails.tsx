import { useState } from "react";
import { Deck } from "../../store/deck/deckSlice";
import DeckModification from "./DeckModification";

export interface DeckProps {
  deck: Deck;
}

function DeckDetails({ deck }: DeckProps) {
  const [isModifying, setIsModifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className={`flip-box-left ${isModifying ? "flip" : ""}`}>
      <div className="flip-box-inner">
        <div className="flip-box-a">
          <div className="flex size-60 flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-xl">
            <div className="flex h-[15%] w-full">
              <h3 className="w-full break-words text-center font-patua text-xl text-textPrimary">
                {deck.name}
              </h3>
            </div>
            <div className="flex h-16 w-full justify-between">
              <button
                type="button"
                onClick={() => setIsModifying(!isModifying)}
              >
                <img
                  src="/modification.png"
                  alt="Modification icon"
                  className="w-16"
                />
              </button>
              <button type="button" onClick={() => setIsDeleting(!isDeleting)}>
                <img src="/deletion.png" alt="Deletion icon" className="w-16" />
              </button>
            </div>
          </div>
        </div>
        <DeckModification
          deck={deck}
          isModifying={isModifying}
          setIsModifying={setIsModifying}
        />
      </div>
    </div>
  );
}

export default DeckDetails;
