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
    <div className="mx-20 flex w-3/5 flex-col rounded-lg bg-tertiary shadow-xl">
      <span className="mt-5 p-10 pb-20 text-center font-patua text-7xl text-textPrimary">
        Tableau des scores
      </span>
      <div className="my-4 flex flex-col items-center justify-center">
        <div className="flex w-4/5 justify-between">
          <div className="h-12 w-4/5 font-patua text-4xl text-textPrimary">
            Nombre de cartes révisées :
          </div>
          <div className="h-12 font-patua text-4xl text-textPrimary">
            {String(cardsToUpdate.length).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-4/5 justify-between">
          <div className="h-12 w-4/5 font-patua text-4xl text-textPrimary">
            Nombre de cartes faciles :
          </div>
          <div className="h-12 font-patua text-4xl text-textPrimary">
            {String(easyCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-4/5 justify-between">
          <div className="h-12 w-4/5 font-patua text-4xl text-textPrimary">
            Nombre de cartes moyennes :
          </div>
          <div className="h-12 font-patua text-4xl text-textPrimary">
            {String(mediumCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-4/5 justify-between">
          <div className="h-12 w-4/5 font-patua text-4xl text-textPrimary">
            Nombre de cartes difficiles :
          </div>
          <div className="h-12 font-patua text-4xl text-textPrimary">
            {String(hardCount).padStart(2, "0")}
          </div>
        </div>
        <div className="mt-10 flex w-4/5 justify-between">
          <div className="h-12 w-4/5 font-patua text-4xl text-textPrimary">
            Nombre de nouvelles cartes :
          </div>
          <div className="h-12 font-patua text-4xl text-textPrimary">
            {String(newCardsCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-4/5 justify-between">
          <div className="h-12 w-4/5 font-patua text-4xl text-textPrimary">
            Nombre de cartes en série de victoires :
          </div>
          <div className="h-12 font-patua text-4xl text-textPrimary">
            {String(winStreakCount).padStart(2, "0")}
          </div>
        </div>
        <div className="flex w-4/5 justify-between">
          <div className="h-12 w-4/5 font-patua text-4xl text-textPrimary">
            Taux de réussite :
          </div>
          <div className="h-12 font-patua text-4xl text-textPrimary">
            {String(successRate).padStart(2, "0")}%
          </div>
        </div>
      </div>
      <div className="mb-5 flex h-32 w-full items-center justify-center gap-44">
        <button
          className="h-16 w-52 rounded-full bg-secondary shadow-xl"
          onClick={onReplay}
        >
          <span className="font-patua text-4xl text-tertiary">Rejouer</span>
        </button>
        <button
          className="h-16 w-52 rounded-full bg-secondary shadow-xl"
          onClick={() => navigate("/user/training/mode")}
        >
          <span className="font-patua text-4xl text-tertiary">Quitter</span>
        </button>
      </div>
    </div>
  );
}

export default ScoreBoard;
