import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useMemo } from "react";
import { getCardsByDeckId } from "../../store/card/cardThunks";
import CardDetails from "./CardDetails";
import CardCreation from "./CardCreation";
import { selectCardsByDeckId } from "../../store/card/cardSelector";

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

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getCardsByDeckId(deckIdNumber));
    }
  }, [dispatch, deckIdNumber, hasBeenFetchedOnce]);

  return (
    <div className="h-full overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-12 pb-8">
        <CardCreation deckId={deckIdNumber} />
        {cards.map((card) => (
          <CardDetails key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default CardsList;
