import { useOutletContext, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useMemo } from "react";
import { getCardsByDeckId } from "../../store/card/cardThunks";
import CardDetails from "./CardDetails";
import CardCreation from "./CardCreation";
import { selectCardsByDeckId } from "../../store/card/cardSelector";
import { Card } from "../../store/card/cardSlice";

function CardsList() {
  const { deckId } = useParams<{ deckId: string }>();
  const deckIdNumber = parseInt(deckId!, 10);
  const dispatch = useAppDispatch();
  const selectDeckCards = useMemo(
    () => selectCardsByDeckId(deckIdNumber),
    [deckIdNumber]
  );
  const cards = useAppSelector(selectDeckCards);
  const hasBeenFetchedOnce = useAppSelector(
    (state) => state.deck.hasBeenFetchedOnce
  );

  const filteredItems = useOutletContext<Card[]>() || cards;

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getCardsByDeckId(deckIdNumber));
    }
  }, [dispatch, deckIdNumber, hasBeenFetchedOnce]);

  return (
    <div className="scrollbar-hide mt-14 overflow-y-auto bg-primary p-8 sm:mt-0">
      <div className="mb-8 grid grid-cols-[repeat(auto-fit,_20rem)] justify-center gap-8 xs:grid-cols-[repeat(auto-fit,_15rem)] xs:justify-normal">
        <CardCreation deckId={deckIdNumber} />
        {filteredItems.map((card) => (
          <CardDetails key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default CardsList;
