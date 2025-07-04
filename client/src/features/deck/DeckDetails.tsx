import { useState } from "react";
import { Deck } from "../../store/deck/deckSlice";
import { useAppDispatch } from "../../store/hooks";
import { updateDeck } from "../../store/deck/deckThunk";

interface DeckProps {
  deck: Deck;
}

const initialState = {
  name: ""
};

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

function DeckDetails({ deck }: DeckProps) {
  const [isModifying, setIsModifying] = useState(false);
  const [deckData, setDeckData] = useState(initialState);
  const dispatch = useAppDispatch();

  const handleEdit = () => {
    setDeckData({ name: deck.name });
    setIsModifying(true);
  };

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!deckData.name) return;

    try {
      await dispatch(updateDeck({ id: deck.id, data: deckData })).unwrap();

      setDeckData(initialState);
      setIsModifying(false);
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setDeckData((prev) => ({
      ...prev,
      name: value
    }));
  };

  return (
    <div className={`flip-box-left ${isModifying ? "flip" : ""}`}>
      <div className="flip-box-inner">
        <div className="flip-box-a">
          <div className="flex size-60 flex-col items-center justify-between rounded-md bg-tertiary bg-[url('/deck.png')] bg-cover pt-3 shadow-xl">
            <div className="flex h-[15%] w-full">
              <h3 className="w-full break-words text-center font-patua text-xl text-textPrimary">
                {deck.name}
              </h3>
            </div>
            <div className="flex h-16 w-full justify-between">
              <button type="button" onClick={handleEdit}>
                <img
                  src="/modification.png"
                  alt="Modification icon"
                  className="w-16"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flip-box-b-left size-60 rounded-lg bg-tertiary shadow-lg">
          <div className="flex h-full flex-col justify-between">
            <h3 className="mt-4 text-center font-patua text-xl">Modifier</h3>
            <div className="flex h-full flex-col items-center justify-center">
              <form
                className="flex flex-col items-center gap-2"
                onSubmit={handleSubmit()}
              >
                <input
                  id="name"
                  type="text"
                  value={deckData.name}
                  onChange={(e) => handleChange(e)}
                  placeholder="Nom du deck"
                  className="mt-2 h-10 w-44 rounded-lg pl-2 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
                />
                <div className="flex w-full justify-between gap-10">
                  <button type="button">
                    <img
                      src="/cancelation.png"
                      alt="Cancelation icon"
                      className="w-20"
                      onClick={() => setIsModifying(!isModifying)}
                    />
                  </button>
                  <button type="submit" className="mr-2">
                    <img
                      src="/validation.png"
                      alt="Validation icon"
                      className="w-16"
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

export default DeckDetails;
