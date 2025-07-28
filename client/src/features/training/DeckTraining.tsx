import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";

function DeckTraining() {
  const { deckId } = useParams<{ deckId: string }>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const navigate = useNavigate();
  const cards = useAppSelector((state) =>
    state.card.cards.filter((card) => card.deck_id === parseInt(deckId!, 10))
  );

  useEffect(() => {
    if (cards.length === 0) {
      navigate("/user/training/mode");
    }
  }, [navigate, cards]);

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-primary">
      {cardIndex < cards.length && (
        <div className="flex h-full items-center justify-center">
          <div className={`flip-training ${isFlipped ? "flip" : ""}`}>
            <div className="flip-box-inner">
              <div
                className="flip-training-a flex h-112 w-112 flex-col rounded-lg bg-tertiary bg-[url('/card.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                  {cards[cardIndex].front}
                </span>
              </div>
              <div
                className="flip-training-b flex h-112 w-112 flex-col rounded-lg bg-tertiary bg-[url('/cardback.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                  {cards[cardIndex].back}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeckTraining;
