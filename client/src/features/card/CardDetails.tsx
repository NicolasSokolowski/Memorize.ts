import { useState } from "react";
import { Card } from "../../store/card/cardSlice";

export interface CardProps {
  card: Card;
}

function CardDetails({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`flip-box-deck ${isFlipped ? "flip-left" : ""}`}>
      <div className="flip-box-inner">
        <div className="flip-box-a">
          <div
            className="relative flex size-60 flex-col items-center justify-between rounded-md bg-tertiary shadow-xl"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flex h-16 w-full">
              <h3 className="w-full break-words pt-3 text-center font-patua text-xl text-textPrimary">
                {card.front}
              </h3>
            </div>
            <img
              src="/card.png"
              alt="Card icon"
              className="absolute top-14 w-32"
              draggable={false}
            />
          </div>
        </div>
        <div className="flip-box-b-left size-60 rounded-lg bg-tertiary shadow-lg">
          <div
            className="relative flex size-60 flex-col items-center justify-between rounded-md bg-tertiary shadow-xl"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flex h-16 w-full">
              <h3 className="w-full break-words pt-3 text-center font-patua text-xl text-textPrimary">
                {card.back}
              </h3>
            </div>
            <img
              src="/cardback.png"
              alt="Card back icon"
              className="absolute top-14 w-32"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;
