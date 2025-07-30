import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import ScoreBoard from "./ScoreBoard";
import { updateCardsStats } from "../../store/card/cardThunks";
import { Card } from "../../store/card/cardSlice";
import { shuffleArray } from "../../helpers/shuffleArray";

export type UserAnswer = {
  id: number;
  user_answer: string;
};

interface LocationState {
  cards: Card[];
}

function DeckTraining() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const cards = useMemo(() => state?.cards ?? [], [state?.cards]);
  const [cardsToUpdate, setCardsToUpdate] = useState<UserAnswer[]>([]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [cardsLeft, setCardsLeft] = useState(cards.length);
  const shuffledCardsRef = useRef<Card[]>([]);
  const currentCard = shuffledCardsRef.current?.[cardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setFlipCount(flipCount + 1);
  };

  const handleNextCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget as HTMLButtonElement;
    const value = button.value;
    setCardsToUpdate((prev) => [
      ...prev,
      { id: currentCard.id, user_answer: value }
    ]);
    setCardsLeft((prev) => prev - 1);
    setFlipCount(0);
    setIsFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => prev + 1);
    }, 200);
  };

  const handleQuit = () => {
    setCardsLeft(0);
    setCardIndex(cards.length);
  };

  const handleReplay = () => {
    setCardIndex(0);
    setIsFlipped(false);
    setFlipCount(0);
    setCardsToUpdate([]);
    setOriginalCards(cards);
    setCardsLeft(cards.length);
    shuffledCardsRef.current = shuffleArray([...cards]);
  };

  useEffect(() => {
    if (cards.length > 0 && shuffledCardsRef.current.length === 0) {
      shuffledCardsRef.current = shuffleArray([...cards]);
      setCardsLeft(cards.length);
      setOriginalCards(cards);
    }
  }, [cards]);

  useEffect(() => {
    if (!cards || cards.length === 0) {
      navigate("/user/training/mode");
    }
  }, [cards, navigate]);

  useEffect(() => {
    const submitStats = async () => {
      try {
        await dispatch(updateCardsStats(cardsToUpdate)).unwrap();
      } catch (err) {
        console.error(err);
      }
    };

    if (cardsLeft === 0 && cardsToUpdate.length > 0) {
      submitStats();
    }
  }, [cardsLeft, cardsToUpdate, dispatch]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-primary">
      {cardIndex < cards.length && (
        <>
          <div className="flex h-32 w-full items-center">
            <div className="mx-20 flex h-40 w-full justify-between">
              <span className="mt-4 font-patua text-3xl text-textPrimary">
                Cartes restantes : {cardsLeft}
              </span>
              <button
                className="h-16 w-40 rounded-full bg-tertiary shadow-xl"
                onClick={() => handleQuit()}
              >
                <span className="font-patua text-3xl text-secondary">
                  Quitter
                </span>
              </button>
            </div>
          </div>

          <div className="flex h-full flex-col items-center justify-center">
            <div className={`flip-training ${isFlipped ? "flip" : ""}`}>
              {currentCard && (
                <div className="flip-box-inner">
                  <div
                    className="flip-training-a flex h-112 w-112 flex-col rounded-lg bg-tertiary bg-[url('/card.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl"
                    onClick={() => handleFlip()}
                  >
                    <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                      {currentCard.front}
                    </span>
                  </div>
                  <div
                    className="flip-training-b flex h-112 w-112 flex-col rounded-lg bg-tertiary bg-[url('/cardback.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl"
                    onClick={() => handleFlip()}
                  >
                    <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                      {currentCard.back}
                    </span>
                  </div>
                </div>
              )}
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
        </>
      )}
      {cardIndex >= cards.length && (
        <ScoreBoard
          cards={originalCards}
          cardsToUpdate={cardsToUpdate}
          onReplay={handleReplay}
        />
      )}
    </div>
  );
}

export default DeckTraining;
