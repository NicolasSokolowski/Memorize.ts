import { useState } from "react";

function DeckCreation() {
  const [isCreating, setIsCreating] = useState(false);

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
        <div className="flip-box-b size-60 rounded-lg bg-tertiary shadow-lg">
          <div className="flex h-full flex-col justify-between">
            <div className="mt-4 text-center font-patua text-xl">Créer</div>
            <div className="flex h-full flex-col items-center justify-center">
              <form className="flex flex-col items-center gap-2">
                <input
                  type="text"
                  placeholder="Nom du deck"
                  className="h-10 w-44 rounded-lg pl-2 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
                ></input>
                <div className="flex w-full justify-between gap-6">
                  <button>
                    <img
                      src="/cancelation.png"
                      alt="Cancelation icon"
                      className="w-24"
                    />
                  </button>
                  <button className="mr-2">
                    <img
                      src="/validation.png"
                      alt="Validation icon"
                      className="w-20"
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
