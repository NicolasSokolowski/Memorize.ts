import { useEffect, useState } from "react";
import { CardProps } from "./CardDetails";
import { useAppDispatch } from "../../store/hooks";
import { updateCard } from "../../store/card/cardThunks";
import { ApiErrorResponse } from "../../types/api";
import ChoiceButton from "../../ui/ChoiceButton";
import { errorInitialState } from "../../types/user";
import Error from "../../ui/Error";

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
  const [error, setError] = useState(errorInitialState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCardData({ front: card.front, back: card.back });
  }, [card]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cardData.front) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "front"])],
        messages: [...prev.messages, "front side is required"]
      }));
      return;
    }

    if (!cardData.back) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "back"])],
        messages: [...prev.messages, "back side is required"]
      }));
      return;
    }

    if (side === "front" && cardData.front === card.front) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "name"])],
        messages: [...prev.messages, "front side is identical"]
      }));
      return;
    }

    try {
      await dispatch(updateCard({ deckId, cardId, data: cardData })).unwrap();
      onCancel();
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;

      if (apiError.errors) {
        for (const e of apiError.errors) {
          setError((prev) => ({
            ...prev,
            fields: e.field
              ? [...new Set([...prev.fields, e.field])]
              : prev.fields,
            messages: e.message ? [...prev.messages, e.message] : prev.messages
          }));
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field !== id),
      messages: prev.messages.filter((message) => !message.includes(id))
    }));

    setCardData((prev) => ({
      ...prev,
      [side]: value
    }));
  };

  return (
    <div
      className="size-full rounded-lg bg-tertiary shadow-custom-light"
      style={{ backfaceVisibility: "visible" }}
    >
      <div className="flex h-full flex-col justify-between font-patua text-textPrimary">
        <h3 className="mt-4 text-center font-patua text-2xl xs:text-xl">
          Modifier
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-4 xs:gap-2"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label
                className="ml-2 text-lg sm:text-base"
                htmlFor={side === "front" ? "front" : "back"}
              >
                {side === "front" ? "Face avant" : "Face arrière"}
              </label>
              <input
                id={side}
                type="text"
                value={cardData[side]}
                onChange={handleChange}
                autoComplete="off"
                placeholder={side === "front" ? "Face avant" : "Face arrière"}
                className={`${
                  error.fields?.includes("front") ||
                  error.fields?.includes("back")
                    ? "ring-2 ring-error"
                    : ""
                } mt-2 h-14 w-60 rounded-lg pl-4 shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-primary xs:h-10 xs:w-44 xs:pl-2 sm:mt-1`}
              />
            </div>
            <div className="h-20">
              <div className={`${error.messages.length > 0 && "hidden"}`}>
                <ChoiceButton
                  width="20"
                  gap="gap-20 sm:gap-10"
                  onCancel={onCancel}
                />
              </div>
            </div>
          </form>
          {error.messages.length > 0 && <Error error={error} />}
        </div>
      </div>
    </div>
  );
}

export default CardModification;
