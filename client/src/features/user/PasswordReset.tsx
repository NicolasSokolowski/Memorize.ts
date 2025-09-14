import { useState } from "react";
import CodeVerificationForm from "./CodeVerificationForm";
import PasswordResetForm from "./PasswordResetForm";
import { sendVerificationCode } from "../../store/user/userThunk";
import { useAppDispatch } from "../../store/hooks";
import { errorInitialState, onCancelProp } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../helpers/handleApiError";

function PasswordReset({ onCancel }: onCancelProp) {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const dispatch = useAppDispatch();
  const [error, setError] = useState(errorInitialState);
  const { t } = useTranslation("auth");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(errorInitialState);
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
    } catch (err: unknown) {
      const parsedError = handleApiError(err, t);
      setError(parsedError);
    }
  };

  return (
    <div className="relative flex min-h-[33rem] flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light xl:min-h-[36rem]">
      <h3 className="m-4 text-center text-xl xl:text-2xl">
        {t("passwordReset")}
      </h3>
      <div className="mx-12 mt-8 flex h-20 flex-1 flex-col">
        <label
          htmlFor="email"
          className="ml-3 font-patua text-xl text-textPrimary"
        >
          E-mail
        </label>
        <input
          id="email"
          type="text"
          className={`${error.fields?.includes("email") ? "ring-2 ring-error" : ""} mt-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
          value={email}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        {!emailHasBeenSent ? (
          <div className="mx-2 mt-3 flex w-full flex-col justify-center">
            <div className="flex w-full justify-center gap-20">
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
      {error.messages.length > 0 && <Error error={error} />}
    </div>
  );
}

export default PasswordReset;
