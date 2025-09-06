import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createCard } from "../../store/card/cardThunks";
import { ApiErrorResponse } from "../../types/api";

const initialState = {
  front: "",
  back: ""
};

interface CardCreationProp {
  deckId: number;
}

const errorsInitialState = {
  front: {
    message: ""
  },
  back: {
    message: ""
  }
};

function CardCreation({ deckId }: CardCreationProp) {
  const [cardData, setCardData] = useState(initialState);
  const [isCreating, setIsCreating] = useState(false);
  const [isInputFlipped, setIsInputFlipped] = useState(false);
  const [error, setError] = useState(errorsInitialState);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError(errorsInitialState);

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
    setError(errorsInitialState);
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
      const error = err as ApiErrorResponse;
      if (error.errors) {
        for (const e of error.errors) {
          if (e.field === "front") {
            setIsInputFlipped(false);
            setError((prev) => ({
              ...prev,
              front: { ...prev.front, message: e.message }
            }));
          } else if (e.field === "back") {
            setError((prev) => ({
              ...prev,
              back: { ...prev.back, message: e.message }
            }));
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
            <h3 className="mt-4 text-center font-patua text-2xl xs:text-xl">
              Créer
            </h3>
            <div className="flex h-full flex-col items-center justify-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 xs:gap-2"
              >
                <div
                  className={`flip-input ${isInputFlipped ? "flip" : ""} flex w-60 justify-center xs:w-44 `}
                >
                  <div className="flip-input-inner">
                    <div className="flip-input-a">
                      <input
                        id="front"
                        type="text"
                        value={cardData.front}
                        onChange={(e) => handleChange(e)}
                        autoComplete="off"
                        placeholder="Face avant"
                        className="mb-2 h-14 w-60 rounded-lg pl-4 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xs:h-10 xs:w-44 xs:pl-2"
                      />
                    </div>
                    <div className="flip-input-b-top">
                      <input
                        id="back"
                        type="text"
                        value={cardData.back}
                        onChange={(e) => handleChange(e)}
                        autoComplete="off"
                        placeholder="Face arrière"
                        className="h-14 w-60 rounded-lg pl-4 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xs:h-10 xs:w-44 xs:pl-2"
                      />
                    </div>
                  </div>
                </div>
                {error.front.message && (
                  <p className="mt-2 w-44 break-words pl-1 font-patua text-sm text-red-500">
                    {error.front.message}
                  </p>
                )}
                {error.back.message && (
                  <p className="mt-2 w-44 break-words pl-1 font-patua text-sm text-red-500">
                    {error.back.message}
                  </p>
                )}
                <div className="flex w-full translate-y--2 justify-between gap-10">
                  <button type="button" onClick={handleCancel}>
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
                    className="mr-2"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardCreation;
