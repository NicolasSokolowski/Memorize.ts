import { useState } from "react";
import { deleteDeck } from "../../store/deck/deckThunk";
import { useAppDispatch } from "../../store/hooks";
import { DeckProps } from "./DeckDetails";

interface DeckModificationProps extends DeckProps {
  onCancel: () => void;
}

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

function DeckDeletion({ deck, onCancel }: DeckModificationProps) {
  const [error, setError] = useState({
    message: ""
  });
  const dispatch = useAppDispatch();

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
        <h3 className="mt-4 text-center font-patua text-xl">Supprimer</h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit()}
          >
            <p className="w-44 pl-2 font-patua text-base text-textPrimary">
              Voulez-vous vraiment supprimer ?
            </p>
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
