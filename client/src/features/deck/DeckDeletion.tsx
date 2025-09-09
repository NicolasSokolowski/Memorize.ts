import { useState } from "react";
import { deleteDeck } from "../../store/deck/deckThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DeckProps } from "./DeckDetails";
import { ApiErrorResponse } from "../../types/api";
import ChoiceButton from "../../ui/ChoiceButton";
import { errorInitialState } from "../../types/user";

interface DeckModificationProps extends DeckProps {
  onCancel: () => void;
}

function DeckDeletion({ deck, onCancel }: DeckModificationProps) {
  const [error, setError] = useState(errorInitialState);
  const dispatch = useAppDispatch();

  const cardsLength = useAppSelector((state) =>
    state.card.cards.filter((card) => card.deck_id === deck.id)
  ).length;

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(deleteDeck(deck.id)).unwrap();

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
    <div className="flip-box-b-right size-full rounded-lg bg-tertiary shadow-custom-light">
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-2xl text-textPrimary xs:text-xl">
          Supprimer
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-4 xs:gap-2"
            onSubmit={handleSubmit()}
          >
            {cardsLength === 0 ? (
              <p className="w-64 pl-2 text-center font-patua text-lg text-textPrimary xs:w-44 xs:text-base">
                Voulez-vous vraiment supprimer ?
              </p>
            ) : (
              <p className="w-64 pl-2 text-center font-patua text-lg text-textPrimary xs:w-44 xs:text-base">
                Cela entraînera la suppression de {cardsLength} carte
                {cardsLength > 1 && "s"}. Êtes-vous sûr ?
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

export default DeckDeletion;
