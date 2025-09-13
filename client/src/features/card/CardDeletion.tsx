import { useState } from "react";
import { Card } from "../../store/card/cardSlice";
import { deleteCard } from "../../store/card/cardThunks";
import { useAppDispatch } from "../../store/hooks";
import { ApiErrorResponse } from "../../types/api";
import ChoiceButton from "../../ui/ChoiceButton";
import { errorInitialState } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";

interface CardDeletionProps {
  card: Card;
  onCancel: () => void;
}

function CardDeletion({ card, onCancel }: CardDeletionProps) {
  const [error, setError] = useState(errorInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["common", "card"]);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        deleteCard({ deckId: card.deck_id, cardId: card.id })
      ).unwrap();

      onCancel();
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;

      if (error.errors) {
        for (const apiError of error.errors) {
          setError((prev) => ({
            ...prev,
            fields: apiError.field
              ? [...new Set([...prev.fields, apiError.field])]
              : prev.fields,
            messages: apiError.message
              ? [...prev.messages, apiError.message]
              : prev.messages
          }));
        }
      }
    }
  };

  return (
    <div
      className="size-full rounded-lg bg-tertiary shadow-custom-light"
      style={{ backfaceVisibility: "visible" }}
    >
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-2xl text-textPrimary xs:text-xl">
          {t("common:delete")}
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit()}
          >
            <p className="w-60 pl-2 text-center font-patua text-lg text-textPrimary xs:w-44 xs:text-base">
              {t("card:deleteCard")}
            </p>
            <ChoiceButton
              width="20"
              gap="gap-20 sm:gap-10"
              onCancel={onCancel}
            />
          </form>
          {error.messages.length > 0 && <Error error={error} />}
        </div>
      </div>
    </div>
  );
}

export default CardDeletion;
