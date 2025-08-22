import { Outlet, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { useEffect, useMemo, useState } from "react";
import { Deck } from "../store/deck/deckSlice";
import { Card } from "../store/card/cardSlice";

function SearchBarLayout() {
  const { deckId } = useParams<{ deckId: string }>();
  const deckIdNumber = parseInt(deckId!, 10);
  const [searchedItem, setSearchedItem] = useState("");
  const location = useLocation();

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
      <div className="relative flex h-14 bg-white shadow-bottom">
        {cardsLocation && (
          <div className="relative ml-12 flex w-1/6 items-center justify-center">
            <div className="flex h-10 w-full items-center rounded-full bg-primary shadow-inner-strong">
              {deck ? (
                <span className="ml-5 font-patua text-lg text-textPrimary">
                  {deck.name}
                </span>
              ) : (
                <span className="ml-5 font-patua text-lg text-textPrimary">
                  Toutes les cartes
                </span>
              )}
            </div>
          </div>
        )}
        <div className="absolute left-1/2 top-1/2 w-1/4 -translate-x-1/2 -translate-y-1/2">
          <div className="my-2 flex h-10 w-full items-center justify-between rounded-full bg-tertiary shadow-inner-strong">
            <input
              className="ml-5 bg-transparent font-patua text-textPrimary focus:outline-none"
              value={searchedItem}
              onChange={(e) => setSearchedItem(e.target.value)}
            ></input>
            <img
              src="/glass.png"
              alt="Magnyfying glass logo"
              className="mr-2 h-10"
            />
          </div>
        </div>
      </div>
      <Outlet context={filteredItems} />
    </>
  );
}

export default SearchBarLayout;
