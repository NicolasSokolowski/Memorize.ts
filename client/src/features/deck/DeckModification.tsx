import { useEffect, useState } from "react";
import { DeckProps } from "./DeckDetails";
import { useAppDispatch } from "../../store/hooks";
import { updateDeck } from "../../store/deck/deckThunk";
import { ApiErrorResponse } from "../../types/api";
import ChoiceButton from "../../ui/ChoiceButton";

const initialState = {
  name: ""
};

interface DeckModificationProps extends DeckProps {
  onCancel: () => void;
}

function DeckModification({ deck, onCancel }: DeckModificationProps) {
  const [deckData, setDeckData] = useState(initialState);
  const [error, setError] = useState({
    name: ""
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDeckData({ name: deck.name });
  }, [deck.name]);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!deckData.name) return;

    if (deckData.name === deck.name) {
      setError({ name: "Le nom est identique." });
      return;
    }

    try {
      await dispatch(updateDeck({ id: deck.id, data: deckData })).unwrap();

      onCancel();
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;

      if (error.errors) {
        for (const e of error.errors) {
          if (e.field === "name") {
            setError((prev) => ({ ...prev, name: e.message }));
          }
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setError((prev) => ({
      ...prev,
      name: ""
    }));

    setDeckData((prev) => ({
      ...prev,
      name: value
    }));
  };

  return (
    <div className="flip-box-b-left size-full rounded-lg bg-tertiary shadow-custom-light">
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-2xl xs:text-xl">
          Modifier
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-4 xs:gap-2"
            onSubmit={handleSubmit()}
          >
            <input
              id="name"
              type="text"
              value={deckData.name}
              onChange={(e) => handleChange(e)}
              placeholder="Nom du deck"
              className="mt-2 h-14 w-60 rounded-lg pl-4 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xs:h-10 xs:w-44 xs:pl-2"
            />
            {error.name && (
              <p className="w-44 break-words pl-1 font-patua text-lg text-red-500 xs:text-sm">
                {error.name}
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

export default DeckModification;
