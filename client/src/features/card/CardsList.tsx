import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { getCardsByDeckId } from "../../store/card/cardThunks";
import { selectCardsByDeckId } from "../../store/card/cardSelector";
import CardDetails from "./CardDetails";
import CardCreation from "./CardCreation";

function CardsList() {
  const { deckId } = useParams<{ deckId: string }>();
  const cards = useAppSelector(selectCardsByDeckId(parseInt(deckId!, 10)));
  const isLoading = useAppSelector((state) => state.card.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cards.length === 0 && !isLoading) {
      dispatch(getCardsByDeckId(parseInt(deckId!, 10)));
    }
  }, [dispatch, cards, deckId, isLoading]);

  return (
    <div className="h-full overflow-y-auto bg-primary p-12">
      <CardCreation />
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-14 pb-8">
        {cards.map((card) => (
          <CardDetails key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default CardsList;
