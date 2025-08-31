import { useState } from "react";
import { Card } from "../../store/card/cardSlice";
import { deleteCard } from "../../store/card/cardThunks";
import { useAppDispatch } from "../../store/hooks";
import { ApiErrorResponse } from "../../types/api";
import ChoiceButton from "../../ui/ChoiceButton";

interface CardDeletionProps {
  card: Card;
  onCancel: () => void;
}

function CardDeletion({ card, onCancel }: CardDeletionProps) {
  const [error, setError] = useState({
    message: ""
  });
  const dispatch = useAppDispatch();

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
        for (const e of error.errors) {
          setError((prev) => ({ ...prev, message: e.message }));
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
          Supprimer
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit()}
          >
            <p className="w-60 pl-2 text-center font-patua text-lg text-textPrimary xs:w-44 xs:text-base">
              Voulez-vous vraiment supprimer ?
            </p>
            {error.message && (
              <p className="w-60 break-words pl-1 font-patua text-lg text-red-500 xs:w-44 xs:text-base">
                {error.message}
              </p>
            )}
            <ChoiceButton
              width="20"
              gap="gap-20 sm:gap-10"
              onCancel={onCancel}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default CardDeletion;
