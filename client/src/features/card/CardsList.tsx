import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { getCardsByDeckId } from "../../store/card/cardThunks";
import { selectCardsByDeckId } from "../../store/card/cardSelector";

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
    <div>
      {cards.map((card) => (
        <div key={card.id}>
          <div>{card.front}</div>
          <div>{card.back}</div>
        </div>
      ))}
    </div>
  );
}

export default CardsList;
