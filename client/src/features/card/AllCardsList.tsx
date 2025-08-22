import { useOutletContext } from "react-router-dom";
import { Card } from "../../store/card/cardSlice";
import CardDetails from "./CardDetails";
import { useAppSelector } from "../../store/hooks";

function AllCardsList() {
  const cards = useAppSelector((state) => state.card.cards);

  const filteredItems = useOutletContext<Card[]>() || cards;

  return (
    <div className="overflow-y-auto bg-primary p-12">
      <div className="grid grid-cols-[repeat(auto-fit,_15rem)] gap-12 pb-8">
        {filteredItems.map((card) => (
          <CardDetails key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default AllCardsList;
