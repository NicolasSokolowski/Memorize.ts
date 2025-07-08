import { useEffect, useState } from "react";
import { Card } from "../../store/card/cardSlice";
import CardModification from "./CardModification";

export interface CardProps {
  card: Card;
}

function CardDetails({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editSide, setEditSide] = useState<"none" | "front" | "back">("none");
  const [visibleFormSide, setVisibleFormSide] = useState<
    "none" | "front" | "back"
  >("none");

  const isEdit = editSide !== "none";
  const isFrontEdit = editSide === "front";
  const isBackEdit = editSide === "back";

  useEffect(() => {
    if (editSide === "none") {
      const timeout = setTimeout(() => {
        setVisibleFormSide("none");
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setVisibleFormSide(editSide);
    }
  }, [editSide]);

  return (
    <div className={`flip-box-deck relative ${isFlipped ? "flip-left" : ""}`}>
      <div className="flip-box-inner">
        {/* Face A */}
        <div className="flip-box-a">
          <div
            className={`flip-card-inner ${isFrontEdit ? "flip-vertical" : ""}`}
          >
            <div className="flip-card-front">
              <div
                className="relative flex size-60 flex-col items-center justify-between rounded-md bg-tertiary shadow-xl"
                onClick={() => {
                  if (!isEdit) setIsFlipped(true);
                }}
              >
                <h3 className="w-full break-words pt-3 text-center font-patua text-xl text-textPrimary">
                  {card.front}
                </h3>
                <img
                  src="/card.png"
                  className="absolute top-14 w-32"
                  draggable={false}
                />
                <div className="flex h-16 w-full justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditSide("front");
                      setIsFlipped(false);
                    }}
                  >
                    <img
                      src="/modification.png"
                      alt="Modification icon"
                      className="w-16"
                      draggable={false}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Formulaire A modification */}
            {visibleFormSide === "front" && (
              <div className="flip-card-back">
                <CardModification
                  deckId={card.deck_id}
                  cardId={card.id}
                  card={card}
                  side="front"
                  onCancel={() => setEditSide("none")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Face B */}
        <div className="flip-box-b-left">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div className={`flip-inner ${isBackEdit ? "flip-x" : ""}`}>
                <div className="flip-face flip-face-front">
                  <div
                    className="relative flex size-60 flex-col items-center justify-between rounded-md bg-tertiary shadow-xl"
                    onClick={() => {
                      if (!isEdit) setIsFlipped(false);
                    }}
                  >
                    <h3 className="w-full break-words pt-3 text-center font-patua text-xl text-textPrimary">
                      {card.back}
                    </h3>
                    <img
                      src="/cardback.png"
                      className="absolute top-14 w-32"
                      draggable={false}
                    />
                    <div className="flex h-16 w-full justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditSide("back");
                        }}
                      >
                        <img
                          src="/modification.png"
                          alt="Modification icon"
                          className="w-16"
                          draggable={false}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Formulaire B modification */}
                {visibleFormSide === "back" && (
                  <div className="flip-face flip-face-back">
                    <CardModification
                      deckId={card.deck_id}
                      cardId={card.id}
                      card={card}
                      side="back"
                      onCancel={() => setEditSide("none")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;
