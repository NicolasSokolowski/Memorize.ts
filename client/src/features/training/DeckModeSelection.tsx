import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useMemo, useState } from "react";
import { getDecks } from "../../store/deck/deckThunk";
import { getAllCardsByUserEmail } from "../../store/card/cardThunks";
import {
  selectDailyCards,
  selectHardCards
} from "../../store/card/cardSelector";
import { useTranslation } from "react-i18next";

function DeckModeSelection() {
  const [dailyCardsLeft, setDailyCardsLeft] = useState(false);
  const [hardCardsLeft, setHardCardsLeft] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("training");

  const memoDailyCards = useMemo(() => selectDailyCards(), []);
  const dailyCards = useAppSelector(memoDailyCards);

  const memoHardCards = useMemo(() => selectHardCards(), []);
  const hardCards = useAppSelector(memoHardCards);

  const decks = useAppSelector((state) => state.deck.decks);

  const hasBeenFetchedOnce = useAppSelector(
    (state) => state.deck.hasBeenFetchedOnce
  );

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getDecks());
      dispatch(getAllCardsByUserEmail());
    }
  }, [dispatch, hasBeenFetchedOnce]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyCardsLeft((prev) => !prev);
      setHardCardsLeft((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex size-full flex-col">
      <h1 className="flex items-center justify-center pb-10 pt-24 font-patua text-4xl text-textPrimary sm:p-10 sm:pb-12 md:py-14 md:text-5xl lg:p-16 lg:pb-20 lg:text-6xl xl:p-24 xl:text-7xl">
        {t("selectDeck")}
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,_21rem)] items-center justify-center gap-8 pb-20">
        <div className="flex size-80 animate-pop flex-col justify-between rounded-lg bg-tertiary bg-[url('/cardback.png')] bg-[length:60%] bg-center bg-no-repeat shadow-custom-light">
          <div className="flex h-16 w-full items-center justify-center font-patua text-2xl text-textPrimary">
            {t("dailyCards")}
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
                  {t("dailyCardsCount", { count: dailyCards.length })}
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
                {t("finished")}
              </span>
            )}
          </div>
        </div>
        <div className="flex size-80 animate-pop flex-col justify-between rounded-lg bg-tertiary bg-[url('/card.png')] bg-[length:60%] bg-center bg-no-repeat shadow-custom-light">
          <div className="flex h-16 w-full items-center justify-center font-patua text-2xl text-textPrimary">
            {t("difficultCards")}
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
                  {t("difficultCardsCount", { count: hardCards.length })}
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
                {t("finished")}
              </span>
            )}
          </div>
        </div>
        <div
          className="flex size-80 animate-pop flex-col justify-between rounded-lg bg-tertiary bg-[url('/deck.png')] bg-cover bg-center bg-no-repeat shadow-custom-light"
          onClick={() => {
            if (decks.length > 0) {
              navigate("/user/training/decks", { state: { decks } });
            }
          }}
        >
          <div className="flex h-16 w-full items-center justify-center font-patua text-2xl text-textPrimary">
            {t("chooseDeck")}
          </div>
          {decks.length === 0 && (
            <div className="flex h-16 w-full items-center justify-center font-patua text-xl text-textPrimary">
              {t("noDecks")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeckModeSelection;
