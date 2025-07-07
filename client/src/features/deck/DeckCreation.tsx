import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createDeck } from "../../store/deck/deckThunk";

const initialState = {
  name: ""
};

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

function DeckCreation() {
  const [deckData, setDeckData] = useState(initialState);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState({
    name: ""
  });
  const dispatch = useAppDispatch();

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

  const handleCancel = () => {
    setDeckData(initialState);
    setError({ name: "" });
    setIsCreating(!isCreating);
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
                onSubmit={handleSubmit()}
                className="flex flex-col items-center gap-2"
              >
                <input
                  id="name"
                  type="text"
                  value={deckData.name}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                  placeholder="Nom du deck"
                  className="mt-2 h-10 w-44 rounded-lg pl-2 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
                />
                {error.name && (
                  <p className="w-44 break-words font-patua text-sm text-red-500">
                    {error.name}
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
      </div>
    </div>
  );
}

export default DeckCreation;
