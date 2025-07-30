import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { getDecks } from "../../store/deck/deckThunk";
import { getAllCardsByUserEmail } from "../../store/card/cardThunks";

function DeckModeSelection() {
  const [dailyCardsLeft, setDailyCardsLeft] = useState(false);
  const [hardCardsLeft, setHardCardsLeft] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dailyCards = useAppSelector((state) =>
    state.card.cards.filter((card) => card.next_occurrence === 0)
  );
  const hardCards = useAppSelector((state) =>
    state.card.cards.filter((card) => card.difficulty <= 15)
  );

  useEffect(() => {
    dispatch(getDecks());
    dispatch(getAllCardsByUserEmail());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyCardsLeft((prev) => !prev);
      setHardCardsLeft((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex size-full flex-col">
      <h1 className="flex h-1/3 items-center justify-center font-patua text-8xl text-textPrimary">
        Sélectionnez un deck
      </h1>
      <div className="flex h-80 w-full justify-center gap-10">
        <div className="flex size-80 flex-col justify-between rounded-lg bg-tertiary bg-[url('/cardback.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl">
          <div className="flex h-16 w-full items-center justify-center font-patua text-2xl text-textPrimary">
            Cartes du jour
          </div>
          <div className="flex h-16 w-full items-center justify-center">
            {dailyCards.length > 0 ? (
              dailyCardsLeft ? (
                <span
                  className="font-patua text-xl text-textPrimary"
                  onClick={() =>
                    navigate("/training", { state: { cards: dailyCards } })
                  }
                >
                  {dailyCards.length} carte{dailyCards.length > 1 ? "s" : ""}{" "}
                  restante{dailyCards.length > 1 ? "s" : ""}
                </span>
              ) : (
                <img
                  src="/training.png"
                  alt="Training icon"
                  className="w-16 cursor-pointer"
                  draggable={false}
                  onClick={() =>
                    navigate("/training", { state: { cards: dailyCards } })
                  }
                />
              )
            ) : (
              <span className="font-patua text-xl text-textPrimary">
                Terminé !
              </span>
            )}
          </div>
        </div>
        <div className="flex size-80 flex-col justify-between rounded-lg bg-tertiary bg-[url('/card.png')] bg-[length:60%] bg-center bg-no-repeat shadow-xl">
          <div className="flex h-16 w-full items-center justify-center font-patua text-2xl text-textPrimary">
            Cartes difficiles
          </div>
          <div className="flex h-16 w-full items-center justify-center">
            {hardCards.length > 0 ? (
              hardCardsLeft ? (
                <span
                  className="font-patua text-xl text-textPrimary"
                  onClick={() =>
                    navigate("/training", { state: { cards: hardCards } })
                  }
                >
                  {hardCards.length} carte{hardCards.length > 1 ? "s" : ""}
                </span>
              ) : (
                <img
                  src="/training.png"
                  alt="Training icon"
                  className="w-16 cursor-pointer"
                  draggable={false}
                  onClick={() =>
                    navigate("/training", { state: { cards: hardCards } })
                  }
                />
              )
            ) : (
              <span className="font-patua text-xl text-textPrimary">
                Terminé !
              </span>
            )}
          </div>
        </div>
        <div
          className="flex size-80 flex-col justify-between rounded-lg bg-tertiary bg-[url('/deck.png')] bg-cover shadow-xl"
          onClick={() => navigate("/user/training/decks")}
        >
          <div className="flex h-16 w-full items-center justify-center font-patua text-2xl text-textPrimary">
            Choisir un deck
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckModeSelection;
