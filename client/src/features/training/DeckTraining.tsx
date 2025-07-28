/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";

type UserAnswer = {
  id: number;
  user_answer: string;
};

function DeckTraining() {
  const { deckId } = useParams<{ deckId: string }>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const navigate = useNavigate();
  const cards = useAppSelector((state) =>
    state.card.cards.filter((card) => card.deck_id === parseInt(deckId!, 10))
  );
  const [cardsToUpdate, setCardsToUpdate] = useState<UserAnswer[]>([]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setFlipCount(flipCount + 1);
  };

  const handleNextCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget as HTMLButtonElement;
    const value = button.value;
    setCardsToUpdate((prev) => [
      ...prev,
      { id: cards[cardIndex].id, user_answer: value }
    ]);
    setFlipCount(0);
    setIsFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => prev + 1);
    }, 200);
  };

  useEffect(() => {
    if (cards.length === 0) {
      navigate("/user/training/mode");
    }
  }, [navigate, cards]);

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-primary">
      {/* <div className="flex bg-red-500 w-full h-12 ">
      </div> */}
      {cardIndex < cards.length && (
        <div className="flex h-full flex-col items-center justify-center self-center">
          <div className={`flip-training ${isFlipped ? "flip" : ""}`}>
            <div className="flip-box-inner">
              <div
                className="flip-training-a flex h-112 w-112 flex-col rounded-lg bg-tertiary bg-[url('/card.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl"
                onClick={() => handleFlip()}
              >
                <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                  {cards[cardIndex].front}
                </span>
              </div>
              <div
                className="flip-training-b flex h-112 w-112 flex-col rounded-lg bg-tertiary bg-[url('/cardback.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl"
                onClick={() => handleFlip()}
              >
                <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                  {cards[cardIndex].back}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-10 flex h-44 w-full justify-center gap-5">
            <button
              className="flex size-44 items-center justify-center rounded-full bg-tertiary shadow-inner-strong"
              value="easy"
              onClick={(e) => handleNextCard(e)}
              disabled={flipCount === 0}
            >
              <div
                className={`relative size-36 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(0,0,0,0.1)]  disabled:cursor-not-allowed ${flipCount === 0 ? "bg-gray-300" : "bg-green-500"}`}
              >
                <div className="absolute -inset-4 -z-10 rounded-full border-t-2"></div>
              </div>
            </button>
            <button
              className="flex size-44 items-center justify-center rounded-full bg-tertiary shadow-inner-strong"
              value="medium"
              onClick={(e) => handleNextCard(e)}
              disabled={flipCount === 0}
            >
              <div
                className={`relative size-36 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed ${flipCount === 0 ? "bg-gray-300" : "bg-orange-400"}`}
              >
                <div className="absolute -inset-4 -z-10 rounded-full border-t-2"></div>
              </div>
            </button>
            <button
              className="flex size-44 items-center justify-center rounded-full bg-tertiary shadow-inner-strong"
              value="hard"
              onClick={(e) => handleNextCard(e)}
              disabled={flipCount === 0}
            >
              <div
                className={`relative size-36 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed ${flipCount === 0 ? "bg-gray-300" : "bg-red-600"}`}
              >
                <div className="absolute -inset-4 -z-10 rounded-full border-t-2"></div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeckTraining;
