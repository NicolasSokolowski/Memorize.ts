import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createCard } from "../../store/card/cardThunks";
import { ApiErrorResponse } from "../../types/api";
import { errorInitialState } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";

const initialState = {
  front: "",
  back: ""
};

interface CardCreationProp {
  deckId: number;
}

function CardCreation({ deckId }: CardCreationProp) {
  const [cardData, setCardData] = useState(initialState);
  const [isCreating, setIsCreating] = useState(false);
  const [isInputFlipped, setIsInputFlipped] = useState(false);
  const [error, setError] = useState(errorInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["common", "card"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field !== id),
      messages: prev.messages.filter((message) => !message.includes(id))
    }));

    setCardData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!cardData.front) return;

    setIsInputFlipped(true);
  };

  const handleCancel = () => {
    setError(errorInitialState);
    setCardData(initialState);
    setIsCreating(!isCreating);
    setIsInputFlipped(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cardData.front || !cardData.back) return;

    try {
      await dispatch(createCard({ deckId, data: cardData })).unwrap();
      setCardData(initialState);
      setIsInputFlipped(false);
      setIsCreating(false);
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

          if (e.field === "front") {
            setIsInputFlipped(false);
          }
        }
      }
    }
  };

  return (
    <div className={`flip-box-deck animate-pop ${isCreating ? "flip" : ""}`}>
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
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-16 xs:gap-10"
              >
                <div
                  className={`flip-input ${isInputFlipped ? "flip" : ""} flex w-60 justify-center xs:w-44`}
                >
                  <div className="flip-input-inner">
                    <div className="flip-input-a font-patua text-textPrimary">
                      <label
                        className="ml-2 text-lg sm:text-base"
                        htmlFor="front"
                      >
                        {t("card:frontSide")}
                      </label>
                      <input
                        id="front"
                        type="text"
                        value={cardData.front}
                        onChange={(e) => handleChange(e)}
                        autoComplete="off"
                        className={`${error.fields?.includes("front") ? "ring-2 ring-error" : ""} mt-2 h-14 w-60 rounded-lg pl-4 shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-primary xs:mt-1 xs:h-10 xs:w-44 xs:pl-2`}
                      />
                    </div>
                    <div className="flip-input-b-top font-patua text-textPrimary">
                      <label
                        className="ml-2 text-lg sm:text-base"
                        htmlFor="back"
                      >
                        {t("card:backSide")}
                      </label>
                      <input
                        id="back"
                        type="text"
                        value={cardData.back}
                        onChange={(e) => handleChange(e)}
                        autoComplete="off"
                        className={`${error.fields?.includes("back") ? "ring-2 ring-error" : ""} mt-2 h-14 w-60 rounded-lg pl-4 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-primary xs:mt-1 xs:h-10 xs:w-44 xs:pl-2`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex h-20 w-full translate-y--2 justify-between gap-10">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`${error.messages.length > 0 && "hidden"}`}
                  >
                    <img
                      src="/cancelation.png"
                      alt="Cancelation icon"
                      className="w-20"
                      draggable={false}
                    />
                  </button>
                  <button
                    type={isInputFlipped ? "submit" : "button"}
                    onClick={isInputFlipped ? undefined : handleClick}
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
              </form>
              {error.messages.length > 0 && <Error error={error} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardCreation;
