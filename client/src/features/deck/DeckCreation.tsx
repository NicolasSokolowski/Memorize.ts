import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createDeck } from "../../store/deck/deckThunk";
import { ApiErrorResponse } from "../../types/api";
import { errorInitialState } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";

const initialState = {
  name: ""
};

function DeckCreation() {
  const [deckData, setDeckData] = useState(initialState);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(errorInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["common", "deck"]);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!deckData.name) return;

    try {
      await dispatch(createDeck(deckData)).unwrap();

      setDeckData(initialState);
      setIsCreating(false);
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
    setDeckData(initialState);
    setError(errorInitialState);
    setIsCreating(!isCreating);
  };

  return (
    <div
      className={`flip-box-deck relative animate-pop ${isCreating ? "flip" : ""}`}
    >
      <div className="flip-box-inner">
        <div className="flip-box-a">
          <button
            className="flex size-full items-center justify-center rounded-lg bg-tertiary shadow-custom-light"
            onClick={() => setIsCreating(!isCreating)}
          >
            <span className="relative top-[-12px] font-patua text-9xl text-secondary">
              +
            </span>
          </button>
        </div>
        <div className="flip-box-b-top mr-2 size-full rounded-lg bg-tertiary shadow-custom-light">
          <div className="flex h-full flex-col justify-between">
            <h3 className="mt-4 text-center font-patua text-2xl text-textPrimary xs:text-xl">
              {t("common:create")}
            </h3>
            <div className="flex h-full flex-col items-center justify-center">
              <form
                onSubmit={handleSubmit()}
                className="flex flex-col items-center gap-4 xs:gap-2"
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
                    autoComplete="off"
                    className={`${error.fields?.includes("name") ? "ring-2 ring-error" : ""} mt-2 h-14 w-60 rounded-lg pl-4 shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-primary xs:h-10 xs:w-44 xs:pl-2 sm:mt-1`}
                  />
                </div>
                <div className="flex h-20 w-full translate-y--2 justify-between gap-10">
                  <button
                    type="button"
                    className={`${error.messages.length > 0 && "hidden"}`}
                  >
                    <img
                      src="/cancelation.png"
                      alt="Cancelation icon"
                      className="w-20"
                      onClick={handleCancel}
                      draggable={false}
                    />
                  </button>
                  <button
                    type="submit"
                    className={`mr-2 ${error.messages.length > 0 && "hidden"}`}
                  >
                    <img
                      src="/validation.png"
                      alt="Validation icon"
                      className="w-16"
                      draggable={false}
                    />
                  </button>
                </div>
                {error.messages.length > 0 && <Error error={error} />}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckCreation;
