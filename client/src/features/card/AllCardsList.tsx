import { useOutletContext } from "react-router-dom";
import { Card } from "../../store/card/cardSlice";
import CardDetails from "./CardDetails";
import { useAppSelector } from "../../store/hooks";

function AllCardsList() {
  const cards = useAppSelector((state) => state.card.cards);

  const filteredItems = useOutletContext<Card[]>() || cards;

  return (
    <div className="scrollbar-hide overflow-y-auto bg-primary p-8">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-8">
        {filteredItems.map((card) => (
          <CardDetails key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default AllCardsList;
