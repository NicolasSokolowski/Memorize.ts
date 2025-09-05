import { useOutletContext } from "react-router-dom";
import { Card } from "../../store/card/cardSlice";
import CardDetails from "./CardDetails";
import { useAppSelector } from "../../store/hooks";

function AllCardsList() {
  const cards = useAppSelector((state) => state.card.cards);

  const filteredItems = useOutletContext<Card[]>() || cards;

  return (
    <div className="scrollbar-hide mt-14 overflow-y-auto bg-primary p-8 sm:mt-0">
      <div className="mb-8 grid grid-cols-[repeat(auto-fit,_20rem)] justify-center gap-8 xs:grid-cols-[repeat(auto-fit,_15rem)] xs:justify-normal">
        {filteredItems.map((card) => (
          <CardDetails key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default AllCardsList;
