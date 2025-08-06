import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { deleteAccount } from "../../store/user/userThunk";

type DeletetFormProps = {
  onCancel: () => void;
};

function DeleteAccount({ onCancel }: DeletetFormProps) {
  const [firstConfirmationCheck, setFirstConfirmationCheck] = useState(false);
  const [userHasBeenDeleted, setUserHasBeenDeleted] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(deleteAccount());
      setUserHasBeenDeleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flip-card-inner ${firstConfirmationCheck ? "flip-vertical" : ""}`}
    >
      <div className="flip-card-front">
        <div className="mt-4 flex size-full flex-col rounded-lg bg-tertiary shadow-lg">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            Supprimer mon compte
          </h3>
          <p className="mx-12 mt-12 text-center font-patua text-xl text-textPrimary">
            Êtes-vous sûr de vouloir supprimer votre compte ?
          </p>
          <div className="mt-5 flex w-full justify-center gap-20">
            <button type="button">
              <img
                src="/cancelation.png"
                alt="Cancelation icon"
                onClick={onCancel}
                className="w-20"
                draggable={false}
              />
            </button>
            <button className="mr-2">
              <img
                src="/validation.png"
                alt="Validation icon"
                onClick={() => setFirstConfirmationCheck(true)}
                className="w-16"
                draggable={false}
              />
            </button>
          </div>
        </div>
      </div>
      {firstConfirmationCheck && (
        <div className="flip-card-back">
          <form
            className="mt-4 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-lg"
            onSubmit={handleSubmit()}
          >
            <h3 className="m-4 text-center text-2xl">Supprimer mon compte</h3>
            <p className="mx-12 mt-12 break-words text-center text-lg">
              Tous vos decks ainsi que toutes vos cartes seront définitivement
              perdus.
              <br />
              Êtes-vous vraiment sûr ?
            </p>
            <div className="mt-5 flex w-full justify-center gap-20">
              <button type="button">
                <img
                  src="/cancelation.png"
                  alt="Cancelation icon"
                  onClick={onCancel}
                  className="w-20"
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
      )}
    </div>
  );
}

export default DeleteAccount;
