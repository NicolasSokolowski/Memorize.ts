import { useState } from "react";
import { deleteDeck } from "../../store/deck/deckThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DeckProps } from "./DeckDetails";
import { ApiErrorResponse } from "../../types/api";

interface DeckModificationProps extends DeckProps {
  onCancel: () => void;
}

function DeckDeletion({ deck, onCancel }: DeckModificationProps) {
  const [error, setError] = useState({
    message: ""
  });
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
        for (const e of error.errors) {
          setError((prev) => ({ ...prev, message: e.message }));
        }
      }
    }
  };

  return (
    <div className="flip-box-b-right size-60 rounded-lg bg-tertiary shadow-lg">
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-xl text-textPrimary">
          Supprimer
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit()}
          >
            {cardsLength === 0 ? (
              <p className="w-44 pl-2 font-patua text-base text-textPrimary">
                Voulez-vous vraiment supprimer ?
              </p>
            ) : (
              <p className="w-44 pl-2 text-center font-patua text-base text-textPrimary">
                Cela entraînera la suppression de {cardsLength} carte
                {cardsLength > 1 && "s"}. Êtes-vous sûr ?
              </p>
            )}
            {error.message && (
              <p className="w-44 break-words pl-1 font-patua text-sm text-red-500">
                {error.message}
              </p>
            )}
            <div className="flex w-full justify-between gap-10">
              <button type="button" onClick={() => onCancel()}>
                <img
                  src="/cancelation.png"
                  alt="Cancelation icon"
                  className="w-20"
                  draggable={false}
                />
              </button>
              <button type="submit" className="mr-2">
                <img
                  src="/validation.png"
                  alt="Validation icon"
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

export default DeckDeletion;
