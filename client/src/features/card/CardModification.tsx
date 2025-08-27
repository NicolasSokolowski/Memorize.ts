import { useEffect, useState } from "react";
import { CardProps } from "./CardDetails";
import { useAppDispatch } from "../../store/hooks";
import { updateCard } from "../../store/card/cardThunks";
import { ApiErrorResponse } from "../../types/api";

type CardSide = "front" | "back";

const initialState = {
  front: "",
  back: ""
};

interface CardModificationProps extends CardProps {
  deckId: number;
  cardId: number;
  side: CardSide;
  onCancel: () => void;
}

function CardModification({
  deckId,
  cardId,
  card,
  side,
  onCancel
}: CardModificationProps) {
  const [cardData, setCardData] = useState(initialState);
  const [error, setError] = useState({
    front: {
      message: ""
    },
    back: {
      message: ""
    }
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCardData({ front: card.front, back: card.back });
  }, [card]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cardData.front === card.front && cardData.back === card.back) return;

    try {
      await dispatch(updateCard({ deckId, cardId, data: cardData })).unwrap();
      onCancel();
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;
      if (error.errors) {
        for (const e of error.errors) {
          if (e.field === "front") {
            setError((prev) => ({
              ...prev,
              front: { ...prev.front, message: e.message }
            }));
          } else if (e.field === "back") {
            setError((prev) => ({
              ...prev,
              back: { ...prev.back, message: e.message }
            }));
          }
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setError((prev) => ({
      ...prev,
      [side]: { ...prev[side], message: "" }
    }));

    setCardData((prev) => ({
      ...prev,
      [side]: value
    }));
  };

  const handleCancel = () => {
    setCardData({ front: card.front, back: card.back });
    setError({ front: { message: "" }, back: { message: "" } });
    onCancel();
  };

  return (
    <div
      className="size-full rounded-lg bg-tertiary shadow-custom-light"
      style={{ backfaceVisibility: "visible" }}
    >
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-2xl xs:text-xl">
          Modifier
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-4 xs:gap-2"
            onSubmit={handleSubmit}
          >
            <input
              id={side}
              type="text"
              value={cardData[side]}
              onChange={handleChange}
              autoComplete="off"
              placeholder={side === "front" ? "Face avant" : "Face arrière"}
              className="mt-2 h-14 w-60 rounded-lg pl-4 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xs:h-10 xs:w-44 xs:pl-2"
            />
            {error[side].message && (
              <p className="w-60 break-words pl-1 font-patua text-lg text-red-500 xs:w-44 xs:text-sm">
                {error[side].message}
              </p>
            )}
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
