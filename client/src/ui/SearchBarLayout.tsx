import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { useMemo, useState } from "react";
import { Deck } from "../store/deck/deckSlice";
import { Card } from "../store/card/cardSlice";

function SearchBarLayout() {
  const [searchedItem, setSearchedItem] = useState("");
  const location = useLocation();

  const store = location.pathname.includes("/cards")
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
      return (items as Card[]).filter(
        (card) =>
          card.front.toLowerCase().includes(search) ||
          card.back.toLowerCase().includes(search)
      );
    }
  }, [items, searchedItem, store.slice]);

  return (
    <>
      <div className="relative flex h-14 justify-center bg-white shadow-bottom">
        <div className="w-1/4">
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
