import { useEffect, useState } from "react";
import { CardProps } from "./CardDetails";
import { useAppDispatch } from "../../store/hooks";
import { updateCard } from "../../store/card/cardThunks";
import ChoiceButton from "../../ui/ChoiceButton";
import { errorInitialState } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import { createHandleChange } from "../../helpers/createHandleChange";
import { handleApiError } from "../../helpers/handleApiError";

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
  const { t } = useTranslation(["common", "card", "errors"]);

  useEffect(() => {
    setCardData({ front: card.front, back: card.back });
  }, [card]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cardData.front) {
      setError({
        ...error,
        fields: [...error.fields, "front"],
        messages: [
          ...error.messages,
          t("errors:validation.string.empty", { label: t("errors:front") })
        ]
      });
      return;
    }

    if (!cardData.back) {
      setError({
        ...error,
        fields: [...error.fields, "back"],
        messages: [
          ...error.messages,
          t("errors:validation.string.empty", { label: t("errors:back") })
        ]
      });
      return;
    }

    if (side === "front" && cardData.front === card.front) {
      setError({
        ...error,
        fields: [...error.fields, "front"],
        messages: [
          ...error.messages,
          t("errors:validation.noChange", {
            label: t("errors:front")
          })
        ]
      });
      return;
    }

    try {
      await dispatch(updateCard({ deckId, cardId, data: cardData })).unwrap();
      onCancel();
    } catch (err: unknown) {
      const parsedError = handleApiError(err, t);
      setError(parsedError);
    }
  };

  const handleChange = createHandleChange(setCardData, setError);

  return (
    <div
      className="size-full rounded-lg bg-tertiary shadow-custom-light"
      style={{ backfaceVisibility: "visible" }}
    >
      <div className="flex h-full flex-col justify-between font-patua text-textPrimary">
        <h3 className="mt-4 text-center font-patua text-2xl xs:text-xl">
          {t("common:modify")}
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
                {side === "front" ? t("card:frontSide") : t("card:backSide")}
              </label>
              <input
                id={side}
                type="text"
                value={cardData[side]}
                onChange={handleChange}
                autoComplete="off"
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
