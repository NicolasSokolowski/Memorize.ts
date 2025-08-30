import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  ApiErrorResponse,
  checkIfEmailIsAvailable,
  sendVerificationCode
} from "../../store/user/userThunk";
import CodeVerificationForm from "./CodeVerificationForm";
import { onCancelProp } from "../../types/user";

function EmailForm({ onCancel }: onCancelProp) {
  const [isNewEmailAvailable, setIsNewEmailAvailable] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const dispatch = useAppDispatch();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newEmail) return;

    try {
      const response = await dispatch(
        checkIfEmailIsAvailable({ newEmail })
      ).unwrap();
      if (response) {
        setIsNewEmailAvailable(true);
        await dispatch(
          sendVerificationCode({
            requestType: "EMAIL_CHANGE",
            subject: "Modification de votre adresse e-mail"
          })
        );
      }
      setIsNewEmailAvailable(response);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      if (apiError?.errors?.length) {
        setError(apiError.errors[0].message);
      }
    }
  };

  useEffect(() => {
    if (isCodeValid) {
      setTimeout(() => {
        onCancel();
        setIsCodeValid(false);
      }, 5000);
    }
  });

  return (
    <div
      className={`flip-card-inner ${isNewEmailAvailable ? "flip-vertical" : ""}`}
    >
      <div className="flip-card-front">
        <div className="mb-6 flex  size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light sm:mx-4">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            Modifier mon adresse e-mail
          </h3>
          <form
            className="mx-12 flex flex-1 flex-col justify-center"
            onSubmit={handleEmailSubmit}
          >
            <label
              htmlFor="email"
              className="ml-1 font-patua text-xl text-textPrimary"
            >
              Nouvelle adresse e-mail
            </label>
            <input
              id="email"
              type="text"
              className="mt-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
              value={newEmail}
              onChange={(e) => {
                setError("");
                setNewEmail(e.target.value);
              }}
              autoComplete="off"
            />
            <div className="mt-5 flex w-full flex-col justify-center ">
              {error && (
                <div className="pl-3 font-patua text-red-500">{error}</div>
              )}
              <div className="flex w-full justify-center gap-20">
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
              </div>
            </div>
          </form>
        </div>
      </div>
      {isNewEmailAvailable && (
        <div className="flip-card-back">
          <div
            className={`flip-card-inner--inner ${isCodeValid ? "flip-vertical" : ""}`}
          >
            <div className="flip-card-back-face">
              <div className="mb-6 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light sm:mx-4">
                <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
                  Modifier mon adresse e-mail
                </h3>
                <CodeVerificationForm
                  onCancel={onCancel}
                  setIsCodeValid={setIsCodeValid}
                  requestType="EMAIL_CHANGE"
                  data={{ newEmail }}
                />
              </div>
            </div>
            <div className="flip-card-back-of-back">
              <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light sm:mx-4">
                <h3 className="m-4 text-center text-2xl">
                  Modifier mon adresse e-mail
                </h3>
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="mt-2 text-center text-xl">Succès !</span>
                  <p className="mx-12 my-8 break-words text-center text-lg">
                    Votre adresse e-mail a été modifiée.
                    <br />
                    <br />
                    Vous allez recevoir un e-mail de confirmation de
                    modification.
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

export default EmailForm;
