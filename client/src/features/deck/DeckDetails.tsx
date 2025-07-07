import { useState } from "react";
import { Deck } from "../../store/deck/deckSlice";
import DeckModification from "./DeckModification";
import DeckDeletion from "./DeckDeletion";
import { useNavigate } from "react-router-dom";

export interface DeckProps {
  deck: Deck;
}

function DeckDetails({ deck }: DeckProps) {
  const [flipSide, setFlipSide] = useState<"none" | "left" | "right">("none");
  const [visibleSide, setVisibleSide] = useState<"none" | "left" | "right">(
    "none"
  );
  const navigate = useNavigate();

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
          <div
            className="flex size-60 flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-xl"
            onClick={() => navigate(`/user/decks/${deck.id}/cards`)}
          >
            <div className="flex h-[15%] w-full">
              <h3 className="w-full break-words text-center font-patua text-xl text-textPrimary">
                {deck.name}
              </h3>
            </div>
            <div className="flex h-16 w-full justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModifyClick();
                }}
              >
                <img
                  src="/modification.png"
                  alt="Modification icon"
                  className="w-16"
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick();
                }}
              >
                <img src="/deletion.png" alt="Deletion icon" className="w-16" />
              </button>
            </div>
          </div>
        </div>
        {visibleSide === "left" && (
          <DeckModification deck={deck} onCancel={() => setFlipSide("none")} />
        )}
        {visibleSide === "right" && (
          <DeckDeletion deck={deck} onCancel={() => setFlipSide("none")} />
        )}
      </div>
    </div>
  );
}

export default DeckDetails;
