import { useState } from "react";
import { Deck } from "../../store/deck/deckSlice";
import DeckModification from "./DeckModification";

export interface DeckProps {
  deck: Deck;
}

function DeckDetails({ deck }: DeckProps) {
  const [flipSide, setFlipSide] = useState<"none" | "left" | "right">("none");
  const [visibleSide, setVisibleSide] = useState<"none" | "left" | "right">(
    "none"
  );

  const handleModifyClick = () => {
    if (flipSide === "left") {
      setFlipSide("none");
      setTimeout(() => setVisibleSide("none"), 800);
    } else {
      setVisibleSide("left");
      setFlipSide("left");
    }
  };

  const handleDeleteClick = () => {
    if (flipSide === "right") {
      setFlipSide("none");
      setTimeout(() => setVisibleSide("none"), 800);
    } else {
      setVisibleSide("right");
      setFlipSide("right");
    }
  };

  return (
    <div
      className={`flip-box-deck ${flipSide === "left" ? "flip-left" : ""} ${flipSide === "right" ? "flip-right" : ""}`}
    >
      <div className="flip-box-inner">
        <div className="flip-box-a">
          <div className="flex size-60 flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-xl">
            <div className="flex h-[15%] w-full">
              <h3 className="w-full break-words text-center font-patua text-xl text-textPrimary">
                {deck.name}
              </h3>
            </div>
            <div className="flex h-16 w-full justify-between">
              <button type="button" onClick={handleModifyClick}>
                <img
                  src="/modification.png"
                  alt="Modification icon"
                  className="w-16"
                />
              </button>
              <button type="button" onClick={handleDeleteClick}>
                <img src="/deletion.png" alt="Deletion icon" className="w-16" />
              </button>
            </div>
          </div>
        </div>
        {visibleSide === "left" && (
          <DeckModification deck={deck} onCancel={() => setFlipSide("none")} />
        )}
        {visibleSide === "right" && (
          <div className="flip-box-b-right size-60 rounded-lg bg-tertiary shadow-lg">
            <div className="flex h-full flex-col justify-between">
              <h3 className="mt-4 text-center font-patua text-xl">Supprimer</h3>
              <div className="flex h-full flex-col items-center justify-center">
                <form className="flex flex-col items-center gap-2">
                  <p className="w-44 pl-2 font-patua text-base text-textPrimary">
                    Voulez-vous vraiment supprimer ?
                  </p>
                  <div className="flex w-full justify-between gap-10">
                    <button type="button" onClick={() => setFlipSide("none")}>
                      <img
                        src="/cancelation.png"
                        alt="Cancelation icon"
                        className="w-20"
                      />
                    </button>
                    <button type="submit" className="mr-2">
                      <img
                        src="/validation.png"
                        alt="Validation icon"
                        className="w-16"
                      />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeckDetails;
