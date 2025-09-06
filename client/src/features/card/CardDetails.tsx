import { useEffect, useState } from "react";
import { Card } from "../../store/card/cardSlice";
import CardModification from "./CardModification";
import CardDeletion from "./CardDeletion";

export interface CardProps {
  card: Card;
}

type Action = "none" | "edit-front" | "edit-back" | "delete-front";

function CardDetails({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeAction, setActiveAction] = useState<Action>("none");
  const [visibleAction, setVisibleAction] = useState<Action>("none");

  const isEdit = activeAction.startsWith("edit");

  useEffect(() => {
    if (activeAction === "none") {
      const timeout = setTimeout(() => {
        setVisibleAction("none");
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setVisibleAction(activeAction);
    }
  }, [activeAction]);

  return (
    <div
      className={`flip-box-deck relative animate-pop ${isFlipped ? "flip-left" : ""}`}
    >
      <div className="flip-box-inner">
        {/* Face A */}
        <div className="flip-box-a">
          <div
            className={`flip-card-inner ${
              activeAction === "edit-front"
                ? "flip-vertical"
                : activeAction === "delete-front"
                  ? "flip-vertical-reverse"
                  : ""
            }`}
          >
            <div className="flip-card-front">
              <div
                className="relative flex size-full flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/card.png')] bg-[length:60%] bg-center bg-no-repeat shadow-custom-light"
                onClick={() => {
                  if (!isEdit) setIsFlipped(true);
                }}
              >
                <h3 className="w-full break-words pt-3 text-center font-patua text-2xl text-textPrimary xs:text-xl">
                  {card.front}
                </h3>
                <div className="flex h-16 w-full justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAction("edit-front");
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAction("delete-front");
                      setIsFlipped(false);
                    }}
                  >
                    <img
                      src="/deletion.png"
                      alt="Deletion icon"
                      className="w-16"
                      draggable={false}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Face A Deletion/Modification forms */}
            {visibleAction === "edit-front" && (
              <div className="flip-card-back">
                <CardModification
                  deckId={card.deck_id}
                  cardId={card.id}
                  card={card}
                  side="front"
                  onCancel={() => setActiveAction("none")}
                />
              </div>
            )}
            {visibleAction === "delete-front" && (
              <div className="flip-card-back">
                <CardDeletion
                  card={card}
                  onCancel={() => setActiveAction("none")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Face B */}
        <div className="flip-box-b-left">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div
                className={`flip-inner ${activeAction === "edit-back" ? "flip-x" : ""}`}
              >
                <div className="flip-face flip-face-front">
                  <div
                    className="relative flex size-full flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/cardback.png')] bg-[length:60%] bg-center bg-no-repeat shadow-custom-light"
                    onClick={() => {
                      if (!isEdit) setIsFlipped(false);
                    }}
                  >
                    <h3 className="w-full break-words pt-3 text-center font-patua text-2xl text-textPrimary xs:text-xl">
                      {card.back}
                    </h3>
                    <div className="flex h-16 w-full justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAction("edit-back");
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

                {/* Face B modification form */}
                {visibleAction === "edit-back" && (
                  <div className="flip-face flip-face-back">
                    <CardModification
                      deckId={card.deck_id}
                      cardId={card.id}
                      card={card}
                      side="back"
                      onCancel={() => setActiveAction("none")}
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
