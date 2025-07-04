import { DeckProps } from "./DeckDetails";

interface DeckModificationProps extends DeckProps {
  onCancel: () => void;
}

function DeckDeletion({ deck, onCancel }: DeckModificationProps) {
  return (
    <div className="flip-box-b-right size-60 rounded-lg bg-tertiary shadow-lg">
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-xl">Supprimer</h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form className="flex flex-col items-center gap-2">
            <p className="w-44 pl-2 font-patua text-base text-textPrimary">
              Voulez-vous vraiment supprimer ?
            </p>
            <div className="flex w-full justify-between gap-10">
              <button type="button" onClick={() => onCancel()}>
                <img
                  src="/cancelation.png"
                  alt="Cancelation icon"
                  className="w-20"
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
  );
}

export default DeckDeletion;
