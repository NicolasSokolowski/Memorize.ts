import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDecks } from "../../store/deck/deckThunk";

function DecksList() {
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.deck.decks);

  useEffect(() => {
    dispatch(getDecks());
  }, [dispatch]);

  return (
    <div>
      {decks.map((deck) => (
        <div key={deck.id}>
          <h3>{deck.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default DecksList;
