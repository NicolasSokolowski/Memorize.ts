import { Card } from "../../store/card/cardSlice";

export interface CardProps {
  card: Card;
}

function CardDetails({ card }: CardProps) {
  return (
    <div className="relative flex size-60 flex-col items-center justify-between rounded-md bg-tertiary shadow-xl">
      <div className="flex h-16 w-full">
        <h3 className="w-full break-words pt-3 text-center font-patua text-xl text-textPrimary">
          {card.front}
        </h3>
      </div>
      <img src="/card.png" alt="Card icon" className="absolute top-14 w-32" />
    </div>
  );
}

export default CardDetails;
