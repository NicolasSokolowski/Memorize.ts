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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-primary">
      {cardIndex < cards.length && (
        <>
          <div className="flex w-full">
            <div className="absolute left-0 top-0 flex h-32 w-full justify-between p-6 px-14 pt-12 sm:p-8 md:pt-16 lg:p-12 ">
              <span className="mx-2 mt-2 font-patua text-xl text-textPrimary sm:text-2xl lg:mt-4 lg:text-2xl xl:text-3xl">
                Cartes restantes : {cardsLeft}
              </span>
              <button
                className="h-12 w-28 rounded-full bg-tertiary shadow-custom-light sm:h-12 sm:w-32 lg:h-14 xl:h-16 xl:w-40"
                onClick={() => handleQuit()}
              >
                <span className="font-patua text-xl text-secondary sm:text-2xl lg:text-2xl xl:text-3xl">
                  Quitter
                </span>
              </button>
            </div>
          </div>

          <div className="flex size-full flex-col items-center justify-center gap-12 lg:gap-14">
            <div className={`flip-training ${isFlipped ? "flip" : ""}`}>
              {currentCard && (
                <div className="flip-box-inner">
                  <div
                    className="flip-training-a flex size-96 flex-col rounded-lg bg-tertiary bg-[url('/card.png')] bg-[length:60%] bg-center bg-no-repeat shadow-custom-light lg:h-112 lg:w-112"
                    onClick={() => handleFlip()}
                  >
                    <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                      {currentCard.front}
                    </span>
                  </div>
                  <div
                    className="flip-training-b flex size-96 flex-col rounded-lg bg-tertiary bg-[url('/cardback.png')] bg-[length:60%] bg-center bg-no-repeat shadow-custom-light lg:h-112 lg:w-112"
                    onClick={() => handleFlip()}
                  >
                    <span className="mt-8 flex w-full justify-center font-patua text-5xl text-textPrimary">
                      {currentCard.back}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex h-32 w-full justify-center gap-3 md:gap-4 lg:h-44 lg:gap-5">
              <button
                className="flex size-36 items-center justify-center rounded-full bg-tertiary shadow-inner-strong lg:size-44"
                value="easy"
                onClick={(e) => handleNextCard(e)}
                disabled={flipCount === 0}
              >
                <div
                  className={`relative size-28 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed  lg:size-36 ${flipCount === 0 ? "bg-gray-300" : "bg-green-500"}`}
                >
                  <div className="absolute -inset-4 -z-10 rounded-full border-t-2"></div>
                </div>
              </button>
              <button
                className="flex size-36 items-center justify-center rounded-full bg-tertiary shadow-inner-strong lg:size-44"
                value="medium"
                onClick={(e) => handleNextCard(e)}
                disabled={flipCount === 0}
              >
                <div
                  className={`relative size-28 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed lg:size-36 ${flipCount === 0 ? "bg-gray-300" : "bg-orange-400"}`}
                >
                  <div className="absolute -inset-4 -z-10 rounded-full border-t-2"></div>
                </div>
              </button>
              <button
                className="flex size-36 items-center justify-center rounded-full bg-tertiary shadow-inner-strong lg:size-44"
                value="hard"
                onClick={(e) => handleNextCard(e)}
                disabled={flipCount === 0}
              >
                <div
                  className={`relative size-28 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed lg:size-36 ${flipCount === 0 ? "bg-gray-300" : "bg-red-600"}`}
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
