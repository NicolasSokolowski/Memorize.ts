import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { deleteAccount } from "../../store/user/userThunk";
import { setUserNull } from "../../store/user/userSlice";

type DeleteFormProps = {
  onCancel: () => void;
};

function DeleteAccount({ onCancel }: DeleteFormProps) {
  const [firstConfirmationCheck, setFirstConfirmationCheck] = useState(false);
  const [userHasBeenDeleted, setUserHasBeenDeleted] = useState(false);
  const [disconnectTimer, setDisconnectTimer] = useState(10);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userHasBeenDeleted) return;

    if (disconnectTimer === 0) {
      dispatch(setUserNull());
      return;
    }

    const timer = setTimeout(() => {
      setDisconnectTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [disconnectTimer, userHasBeenDeleted, dispatch]);

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
          <div
            className={`flip-card-inner--inner ${userHasBeenDeleted ? "flip-vertical" : ""}`}
          >
            <div className="flip-card-back-face">
              <form
                className="mt-4 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-lg"
                onSubmit={handleSubmit()}
              >
                <h3 className="m-4 text-center text-2xl">
                  Supprimer mon compte
                </h3>
                <p className="mx-12 mt-12 break-words text-center text-lg">
                  Tous vos decks ainsi que toutes vos cartes seront
                  définitivement perdus.
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
            <div className="flip-card-back-of-back">
              <div className="mt-4 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-lg">
                <h3 className="m-4 text-center text-2xl">
                  Supprimer mon compte
                </h3>
                <span className="mt-2 text-center text-xl">Succès !</span>
                <p className="mx-12 my-8 break-words text-center">
                  Votre compte a été supprimé.
                  <br />
                  <br />
                  Vous allez recevoir un e-mail de confirmation de suppression.
                  Vous allez être déconnecté dans {disconnectTimer} s.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccount;
