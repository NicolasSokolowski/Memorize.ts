import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setUserNull } from "../../store/user/userSlice";
import CodeVerificationForm from "./CodeVerificationForm";
import {
  ApiErrorResponse,
  sendVerificationCode
} from "../../store/user/userThunk";

type DeleteFormProps = {
  onCancel: () => void;
};

function DeleteAccount({ onCancel }: DeleteFormProps) {
  const [firstConfirmationCheck, setFirstConfirmationCheck] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [disconnectTimer, setDisconnectTimer] = useState(10);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        sendVerificationCode({
          requestType: "ACCOUNT_DELETE",
          subject: "Suppression de votre adresse e-mail"
        })
      ).unwrap();
      setFirstConfirmationCheck(true);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError?.errors?.length) {
        setError(apiError.errors[0].message);
      }
    }
  };

  useEffect(() => {
    if (!isCodeValid) return;

    if (disconnectTimer === 0) {
      dispatch(setUserNull());
      return;
    }

    const timer = setTimeout(() => {
      setDisconnectTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [disconnectTimer, isCodeValid, dispatch]);

  return (
    <div
      className={`flip-card-inner ${firstConfirmationCheck ? "flip-vertical" : ""}`}
    >
      <div className="flip-card-front">
        <div className="mt-4 flex size-full flex-col rounded-lg bg-tertiary shadow-lg">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            Supprimer mon compte
          </h3>
          <div className="mx-12 flex flex-1 flex-col justify-center">
            {error ? (
              <div className="pl-3 font-patua text-red-500">{error}</div>
            ) : (
              <>
                <p className="text-center font-patua text-xl text-textPrimary">
                  Êtes-vous sûr de vouloir supprimer votre compte ?
                </p>
                <form
                  className="mt-5 flex w-full justify-center gap-20"
                  onSubmit={handleSubmit}
                >
                  <button type="button">
                    <img
                      src="/cancelation.png"
                      alt="Cancelation icon"
                      onClick={onCancel}
                      className="w-24"
                      draggable={false}
                    />
                  </button>
                  <button type="submit" className="mr-2">
                    <img
                      src="/validation.png"
                      alt="Validation icon"
                      className="w-20"
                      draggable={false}
                    />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      {firstConfirmationCheck && (
        <div className="flip-card-back">
          <div
            className={`flip-card-inner--inner ${isCodeValid ? "flip-vertical" : ""}`}
          >
            <div className="flip-card-back-face">
              <div className="mt-4 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-lg">
                <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
                  Modifier mon adresse e-mail
                </h3>
                <CodeVerificationForm
                  onCancel={onCancel}
                  setIsCodeValid={setIsCodeValid}
                  requestType="ACCOUNT_DELETE"
                />
              </div>
            </div>
            <div className="flip-card-back-of-back">
              <div className="mt-4 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-lg">
                <h3 className="mt-4 text-center text-2xl">
                  Supprimer mon compte
                </h3>
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="text-center text-xl">Succès !</span>
                  <p className="mx-12 my-8 break-words text-center">
                    Votre compte a été supprimé.
                    <br />
                    <br />
                    Vous allez recevoir un e-mail de confirmation de
                    suppression. Vous allez être déconnecté dans{" "}
                    {disconnectTimer} s.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccount;
