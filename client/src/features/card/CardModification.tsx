import { useEffect, useState } from "react";
import { CardProps } from "./CardDetails";

type CardSide = "front" | "back";

const initialState = {
  front: "",
  back: ""
};

interface CardModificationProps extends CardProps {
  side: CardSide;
  onCancel: () => void;
}

function CardModification({ card, side, onCancel }: CardModificationProps) {
  const [cardData, setCardData] = useState(initialState);

  useEffect(() => {
    setCardData({ front: card.front, back: card.back });
  }, [card]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [side]: value
    }));
  };

  const handleCancel = () => {
    setCardData({ front: card.front, back: card.back });
    onCancel();
  };

  return (
    <div
      className="size-60 rounded-lg bg-tertiary shadow-lg"
      style={{ backfaceVisibility: "visible" }}
    >
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-xl">Modifier</h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form className="flex flex-col items-center gap-2">
            <input
              id={side}
              type="text"
              value={cardData[side]}
              onChange={handleChange}
              placeholder={side === "front" ? "Face avant" : "Face arrière"}
              className="mt-2 h-10 w-44 rounded-lg pl-2 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
            />
            <div className="flex w-full justify-between gap-10">
              <button type="button" onClick={handleCancel}>
                <img
                  src="/cancelation.png"
                  alt="Cancel"
                  className="w-20"
                  draggable={false}
                />
              </button>
              <button type="submit" className="mr-2">
                <img
                  src="/validation.png"
                  alt="Validate"
                  className="w-16"
                  draggable={false}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CardModification;
