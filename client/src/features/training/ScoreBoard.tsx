import { useNavigate } from "react-router-dom";
import { Card } from "../../store/card/cardSlice";
import { UserAnswer } from "./DeckTraining";

type ScoreBoardProps = {
  cards: Card[];
  cardsToUpdate: UserAnswer[];
  onReplay: () => void;
};

function ScoreBoard({ cards, cardsToUpdate, onReplay }: ScoreBoardProps) {
  const navigate = useNavigate();

  const winningCards = cardsToUpdate.filter((updatedCard) => {
    const originalCard = cards.find((c) => c.id === updatedCard.id);
    return updatedCard.user_answer === "easy" && originalCard!.win_streak >= 1;
  });

  const winStreakCount = winningCards.length;

  const total = cardsToUpdate.length;
  const easyCount = cardsToUpdate.filter(
    (card) => card.user_answer === "easy"
  ).length;
  const mediumCount = cardsToUpdate.filter(
    (card) => card.user_answer === "medium"
  ).length;
  const hardCount = cardsToUpdate.filter(
    (card) => card.user_answer === "hard"
  ).length;

  const newCardsCount = cards.filter((card) => card.difficulty === 0).length;

  const successRate =
    total > 0 ? Math.round(((easyCount + mediumCount / 2) / total) * 100) : 0;

  return (
    <div className="flex w-4/5 flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light">
      <span className="p-8 text-center text-4xl md:text-5xl lg:text-6xl xl:p-14 xl:text-7xl">
        Tableau des scores
      </span>
      <div className="flex flex-col items-center justify-between text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        <div className="flex w-full justify-between">
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            Nombre de cartes révisées :
          </div>
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            {String(cardsToUpdate.length).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            Nombre de cartes faciles :
          </div>
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            {String(easyCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            Nombre de cartes moyennes :
          </div>
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            {String(mediumCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            Nombre de cartes difficiles :
          </div>
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            {String(hardCount).padStart(2, "0")}
          </div>
        </div>
        <div className="mt-10 flex w-full justify-between">
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            Nombre de nouvelles cartes :
          </div>
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            {String(newCardsCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="mx-8 mb-6 p-1 sm:mx-10 sm:p-2 md:mx-16 md:mb-0 lg:mx-20 xl:mx-24">
            Nombre de cartes en série de victoires :
          </div>
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            {String(winStreakCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            Taux de réussite :
          </div>
          <div className="mx-8 p-1 sm:mx-10 sm:p-2 md:mx-16 lg:mx-20 xl:mx-24">
            {String(successRate).padStart(2, "0")}%
          </div>
        </div>
      </div>
      <div className="mb-5 flex h-24 w-full items-center justify-center gap-8 sm:gap-24 md:h-28 md:gap-32 lg:h-32 lg:gap-36 xl:gap-44">
        <button
          className="h-12 w-36 rounded-full bg-secondary shadow-custom-light md:h-14 lg:h-16 lg:w-52"
          onClick={onReplay}
        >
          <span className="text-2xl text-tertiary md:text-2xl lg:text-4xl">
            Rejouer
          </span>
        </button>
        <button
          className="h-12 w-36 rounded-full bg-secondary shadow-custom-light md:h-14 lg:h-16 lg:w-52"
          onClick={() => navigate("/user/training/mode")}
        >
          <span className="text-2xl text-tertiary md:text-2xl lg:text-4xl">
            Quitter
          </span>
        </button>
      </div>
    </div>
  );
}

export default ScoreBoard;
