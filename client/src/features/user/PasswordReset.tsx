import { useState } from "react";
import CodeVerificationForm from "./CodeVerificationForm";
import PasswordResetForm from "./PasswordResetForm";
import {
  ApiErrorResponse,
  sendVerificationCode
} from "../../store/user/userThunk";
import { useAppDispatch } from "../../store/hooks";
import { onCancelProp } from "../../types/user";

function PasswordReset({ onCancel }: onCancelProp) {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setEmail(e.target.value);
    setEmailHasBeenSent(false);
    setIsCodeValid(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        sendVerificationCode({
          requestType: "PASSWORD_RESET",
          subject: "Réinitialisation de votre mot de passe",
          data: { email }
        })
      ).unwrap();
      setEmailHasBeenSent(true);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError?.errors?.length) {
        setError(apiError.errors[0].message);
      }
    }
  };

  return (
    <div className="flex size-full h-144 flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light">
      <h3 className="m-4 text-center text-2xl">
        Réinitialisation du mot de passe
      </h3>
      <div className="mx-12 mt-8 flex h-20 flex-1 flex-col">
        <label
          htmlFor="email"
          className="ml-3 font-patua text-xl text-textPrimary"
        >
          Adresse e-mail
        </label>
        <input
          id="email"
          type="text"
          className="mt-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
          value={email}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        {!emailHasBeenSent ? (
          <div className="mx-2 mt-3 flex w-full flex-col justify-center">
            <div className="flex w-full justify-center gap-20">
              {error ? (
                <p className="break-words pl-2 font-patua text-red-500">
                  {error}
                </p>
              ) : (
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
                  <button
                    type="button"
                    className="mr-2"
                    onClick={(e) => handleSubmit(e)}
                  >
                    <img
                      src="/validation.png"
                      alt="Validation icon"
                      className="w-20"
                      draggable={false}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center">
            {!isCodeValid ? (
              <CodeVerificationForm
                onCancel={onCancel}
                setIsCodeValid={setIsCodeValid}
                requestType="PASSWORD_RESET"
                data={{ email }}
              />
            ) : (
              <PasswordResetForm onCancel={onCancel} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordReset;
