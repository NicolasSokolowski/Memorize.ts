import { useEffect, useState } from "react";
import { DeckProps } from "./DeckDetails";
import { useAppDispatch } from "../../store/hooks";
import { updateDeck } from "../../store/deck/deckThunk";
import { ApiErrorResponse } from "../../types/api";
import ChoiceButton from "../../ui/ChoiceButton";
import { errorInitialState } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";

const initialState = {
  name: ""
};

interface DeckModificationProps extends DeckProps {
  onCancel: () => void;
}

function DeckModification({ deck, onCancel }: DeckModificationProps) {
  const [deckData, setDeckData] = useState(initialState);
  const [error, setError] = useState(errorInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["common", "deck"]);

  useEffect(() => {
    setDeckData({ name: deck.name });
  }, [deck.name]);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!deckData.name) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "name"])],
        messages: [...prev.messages, "Deck name is required"]
      }));
      return;
    }

    if (deckData.name === deck.name) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "name"])],
        messages: [...prev.messages, "Deck name is identical"]
      }));
      return;
    }

    try {
      await dispatch(updateDeck({ id: deck.id, data: deckData })).unwrap();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field !== id),
      messages: prev.messages.filter((message) => !message.includes(id))
    }));

    setDeckData((prev) => ({
      ...prev,
      name: value
    }));
  };

  const handleCancel = () => {
    setDeckData(deck);
    setError(errorInitialState);
    onCancel();
  };

  return (
    <div className="flip-box-b-left size-full rounded-lg bg-tertiary shadow-custom-light">
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-2xl text-textPrimary xs:text-xl">
          {t("common:modify")}
        </h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-4 xs:gap-2"
            onSubmit={handleSubmit()}
          >
            <div className="flex flex-col font-patua text-lg text-textPrimary sm:text-base">
              <label className="ml-2 " htmlFor="name">
                {t("deck:deckName")}
              </label>
              <input
                id="name"
                type="text"
                value={deckData.name}
                onChange={(e) => handleChange(e)}
                className={`${error.fields?.includes("name") ? "ring-2 ring-error" : ""} mt-2 h-14 w-60 rounded-lg pl-4 font-patua text-textPrimary shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-primary xs:h-10 xs:w-44 xs:pl-2 sm:mt-1`}
              />
            </div>
            <div className="h-20">
              <div className={`${error.messages.length > 0 && "hidden"}`}>
                <ChoiceButton
                  width="20"
                  gap="gap-20 xs:gap-10"
                  onCancel={handleCancel}
                />
              </div>
            </div>
            {error.messages.length > 0 && <Error error={error} />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeckModification;
