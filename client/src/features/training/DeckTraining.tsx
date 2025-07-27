import { useState } from "react";

function DeckTraining() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-primary">
      <div className="flex h-full items-center justify-center">
        <div className={`flip-training ${isFlipped ? "flip" : ""}`}>
          <div className="flip-box-inner">
            <div
              className="flip-training-a flex h-112 w-112 flex-col rounded-lg bg-tertiary shadow-xl"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <span>Card's front face</span>
            </div>
            <div
              className="flip-training-b flex h-112 w-112 flex-col rounded-lg bg-tertiary shadow-xl"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <span>Card's back face</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckTraining;
