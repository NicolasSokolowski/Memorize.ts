import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios.instance";
import { errorInitialState, onCancelProp } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../helpers/handleApiError";
import { createHandleChange } from "../../helpers/createHandleChange";
import i18next from "i18next";

function PasswordResetForm({ onCancel }: onCancelProp) {
  const [passwordHasBeenChanged, setPasswordHasBeenChanged] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    passwordConfirmation: ""
  });
  const [error, setError] = useState(errorInitialState);
  const { t } = useTranslation(["auth", "errors"]);

  useEffect(() => {
    if (passwordHasBeenChanged) {
      setTimeout(() => {
        onCancel();
      }, 5000);
    }
  });

  const handleChange = createHandleChange(setPasswordData, setError);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordData.newPassword || !passwordData.passwordConfirmation) {
      setError({
        ...error,
        messages: [...error.messages, t("errors:allFields")]
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.passwordConfirmation) {
      setError({
        ...error,
        fields: [...error.fields, "newPassword"],
        messages: [...error.messages, t("errors:passwordMisMatch")]
      });
      return;
    }

    try {
      await axiosInstance.patch(
        "/profile/resetpw",
        {
          newPassword: passwordData.newPassword,
          passwordConfirmation: passwordData.passwordConfirmation,
          subject: t("auth:passwordModification"),
          object: t("auth:password").toLowerCase()
        },
        {
          headers: {
            "Accept-Language": i18next.language
          }
        }
      );
      setPasswordHasBeenChanged(true);
    } catch (err: unknown) {
      const parsedError = handleApiError(err, t);
      setError(parsedError);
    }
  };

  return (
    <>
      <form
        className="mt-8 flex flex-1 flex-col justify-center"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="new-pw"
          className="ml-1 font-patua text-xl text-textPrimary"
        >
          {t("auth:newPassword")}
        </label>
        <input
          id="newPassword"
          type="password"
          className={`${error.messages.length > 0 ? "ring-2 ring-error" : ""} my-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
          value={passwordData.newPassword}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        <label
          htmlFor="passwordConfirmation"
          className="ml-1 font-patua text-xl text-textPrimary"
        >
          {t("auth:passwordConfirmation")}
        </label>
        <input
          id="passwordConfirmation"
          type="password"
          className={`${error.messages.length > 0 ? "ring-2 ring-error" : ""} my-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
          value={passwordData.passwordConfirmation}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        {!passwordHasBeenChanged ? (
          <div className="mt-5 flex h-24 w-full justify-center gap-20">
            <button type="button">
              <img
                src="/images/cancelation.png"
                alt="Cancelation icon"
                onClick={onCancel}
                className="w-24"
                draggable={false}
              />
            </button>
            <button type="submit" className="mr-2">
              <img
                src="/images/validation.png"
                alt="Validation icon"
                className="w-20"
                draggable={false}
              />
            </button>
          </div>
        ) : (
          <div className="mt-5 flex h-24 flex-col items-center justify-center">
            <p className="mt-4 text-center font-patua text-base text-textPrimary">
              {t("resetSuccess")}
            </p>
          </div>
        )}
      </form>
      {error.messages.length > 0 && <Error error={error} />}
    </>
  );
}

export default PasswordResetForm;
