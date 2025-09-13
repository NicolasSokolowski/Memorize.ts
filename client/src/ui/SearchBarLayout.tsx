import { Outlet, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { useEffect, useMemo, useState } from "react";
import { Deck } from "../store/deck/deckSlice";
import { Card } from "../store/card/cardSlice";
import { useTranslation } from "react-i18next";

function SearchBarLayout() {
  const { deckId } = useParams<{ deckId: string }>();
  const deckIdNumber = parseInt(deckId!, 10);
  const [searchedItem, setSearchedItem] = useState("");
  const location = useLocation();
  const { t } = useTranslation("card");

  const cardsLocation = location.pathname.includes("/cards");

  const deck = useAppSelector((state) =>
    state.deck.decks.find((deck) => deck.id === deckIdNumber)
  );

  const store = cardsLocation
    ? { slice: "card" as const, items: "cards" as const }
    : { slice: "deck" as const, items: "decks" as const };

  const items = useAppSelector((state: RootState) =>
    store.slice === "deck" ? state.deck[store.items] : state.card[store.items]
  );

  const filteredItems = useMemo(() => {
    const search = searchedItem.toLowerCase();
    if (store.slice === "deck") {
      return (items as Deck[]).filter((deck) =>
        deck.name.toLowerCase().includes(search)
      );
    } else {
      return (items as Card[]).filter((card) => {
        if (deckIdNumber) {
          return (
            card.deck_id === deckIdNumber &&
            (card.front.toLowerCase().includes(search) ||
              card.back.toLowerCase().includes(search))
          );
        } else {
          return (
            card.front.toLowerCase().includes(search) ||
            card.back.toLowerCase().includes(search)
          );
        }
      });
    }
  }, [items, searchedItem, store.slice, deckIdNumber]);

  useEffect(() => {
    setSearchedItem("");
  }, [location]);

  return (
    <>
      <div className="sticky top-16 z-10 flex h-14 bg-white shadow-bottom sm:top-0">
        {cardsLocation && (
          <div className="relative ml-4 flex max-w-64 items-center justify-center sm:ml-8 sm:w-[7.5rem] lg:w-52 xl:w-64">
            <div className="flex h-10 w-full items-center rounded-full sm:bg-primary sm:shadow-inner-strong">
              {deck ? (
                <span className="font-patua text-sm text-textPrimary sm:ml-5 lg:text-lg">
                  {deck.name}
                </span>
              ) : (
                <span className="font-patua text-sm text-textPrimary sm:ml-2 lg:ml-5 lg:text-lg">
                  {t("allCards")}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="absolute left-1/2 top-1/2 w-1/3 min-w-36 -translate-x-1/2 -translate-y-1/2">
          <div className="relative my-2 flex h-10 w-full max-w-96 items-center justify-between rounded-full bg-tertiary shadow-inner-strong">
            <input
              className="ml-5 bg-transparent font-patua text-textPrimary focus:outline-none"
              value={searchedItem}
              onChange={(e) => setSearchedItem(e.target.value)}
            ></input>
            <img
              src="/glass.png"
              alt="Magnyfying glass logo"
              className="absolute right-2 h-10"
            />
          </div>
        </div>
      </div>
      <Outlet context={filteredItems} />
    </>
  );
}

export default SearchBarLayout;
