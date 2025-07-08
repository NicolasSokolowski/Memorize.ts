import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createCard } from "../../store/card/cardThunks";

const initialState = {
  front: "",
  back: ""
};

interface CardCreationProp {
  deckId: number;
}

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

const errorsInitialState = {
  frontMessage: "",
  backMessage: ""
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
            setError((prev) => ({ ...prev, frontMessage: e.message }));
          } else if (e.field === "back") {
            setError((prev) => ({ ...prev, backMessage: e.message }));
          }
        }
      }
    }
  };

  return (
    <div className={`flip-box-deck ${isCreating ? "flip" : ""}`}>
      <div className="flip-box-inner">
        <div className="flip-box-a">
          <button
            className="flex size-60 items-center justify-center rounded-lg bg-tertiary shadow-lg"
            onClick={() => setIsCreating(!isCreating)}
          >
            <span className="relative top-[-12px] font-patua text-9xl text-secondary">
              +
            </span>
          </button>
        </div>
        <div className="flip-box-b-top mr-2 size-60 rounded-lg bg-tertiary shadow-lg">
          <div className="flex h-full flex-col justify-between">
            <h3 className="mt-4 text-center font-patua text-xl">Créer</h3>
            <div className="flex h-full flex-col items-center justify-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
              >
                <div className={`flip-input ${isInputFlipped ? "flip" : ""}`}>
                  <div className="flip-input-inner">
                    <div className="flip-input-a">
                      <input
                        id="front"
                        type="text"
                        value={cardData.front}
                        onChange={(e) => handleChange(e)}
                        autoComplete="off"
                        placeholder="Face avant"
                        className="mb-2 h-10 w-44 rounded-lg pl-2 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
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
                        className="h-10 w-44 rounded-lg pl-2 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
                      />
                    </div>
                  </div>
                </div>
                {error.frontMessage && (
                  <p className="mt-2 w-44 break-words pl-1 font-patua text-sm text-red-500">
                    {error.frontMessage}
                  </p>
                )}
                {error.backMessage && (
                  <p className="mt-2 w-44 break-words pl-1 font-patua text-sm text-red-500">
                    {error.backMessage}
                  </p>
                )}
                <div className="flex w-full translate-y--2 justify-between gap-10">
                  <button type="button">
                    <img
                      src="/cancelation.png"
                      alt="Cancelation icon"
                      className="w-20"
                      onClick={handleCancel}
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
