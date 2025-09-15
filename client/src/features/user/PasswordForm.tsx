import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios.instance";
import { errorInitialState, onCancelProp } from "../../types/user";
import ChoiceButton from "../../ui/ChoiceButton";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../helpers/handleApiError";
import { createHandleChange } from "../../helpers/createHandleChange";

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: ""
};

function PasswordForm({ onCancel }: onCancelProp) {
  const [passwordHasBeenChanged, setPasswordHasBeenChanged] = useState(false);
  const [passwordData, setPasswordData] = useState(initialState);
  const [error, setError] = useState(errorInitialState);
  const { t } = useTranslation(["auth", "errors"]);

  useEffect(() => {
    if (passwordHasBeenChanged) {
      const timeout = setTimeout(() => {
        onCancel();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [passwordHasBeenChanged, onCancel]);

  const handleChange = createHandleChange(setPasswordData, setError);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      setError({
        ...error,
        fields: [...error.fields, "currentPassword"],
        messages: [
          ...error.messages,
          t("errors:validation.string.empty", {
            label: t("errors:currentPassword")
          })
        ]
      });
      return;
    }

    if (!passwordData.newPassword) {
      setError({
        ...error,
        fields: [...error.fields, "newPassword"],
        messages: [
          ...error.messages,
          t("errors:validation.string.empty", {
            label: t("errors:newPassword")
          })
        ]
      });
      return;
    }

    if (!passwordData.confirmNewPassword) {
      setError({
        ...error,
        fields: [...error.fields, "confirmNewPassword"],
        messages: [
          ...error.messages,
          t("errors:validation.string.empty", {
            label: t("errors:passwordConfirmation")
          })
        ]
      });
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "newPassword"])],
        messages: [
          ...prev.messages,
          t("errors:validation.noChange", { label: t("errors:newPassword") })
        ]
      }));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError({
        ...error,
        fields: [...error.fields, "newPassword", "confirmNewPassword"],
        messages: [...error.messages, t("errors:passwordMisMatch")]
      });
      return;
    }

    try {
      await axiosInstance.patch("/profile/changepw", passwordData);
      setPasswordHasBeenChanged(true);
    } catch (err: unknown) {
      const parsedError = handleApiError(err, t);
      setError(parsedError);
    }
  };

  return (
    <div
      className={`flip-card-inner ${passwordHasBeenChanged ? "flip-vertical" : ""}`}
    >
      <div className="flip-card-front">
        <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            {t("auth:buttons.edit-password")}
          </h3>
          <form
            onSubmit={handleSubmit()}
            className="mx-12 flex flex-1 flex-col justify-center"
          >
            <label
              htmlFor="currentPassword"
              className="ml-1 font-patua text-textPrimary"
            >
              {t("auth:currentPassword")}
            </label>
            <input
              id="currentPassword"
              type="password"
              className={`${error.fields?.includes("currentPassword") ? "ring-2 ring-error" : ""} my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
              value={passwordData.currentPassword}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            <label
              htmlFor="newPassword"
              className="ml-1 font-patua text-textPrimary"
            >
              {t("auth:newPassword")}
            </label>
            <input
              id="newPassword"
              type="password"
              className={`${error.fields?.includes("newPassword") ? "ring-2 ring-error" : ""} my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
              value={passwordData.newPassword}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            <label
              htmlFor="confirmNewPassword"
              className="ml-1 font-patua text-textPrimary"
            >
              {t("auth:passwordConfirmation")}
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              className={`${error.fields?.includes("confirmNewPassword") ? "ring-2 ring-error" : ""} my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
              value={passwordData.confirmNewPassword}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            <div className="h-20">
              <div className={`${error.messages.length > 0 && "hidden"}`}>
                <ChoiceButton width="20" gap="gap-20" onCancel={onCancel} />
              </div>
            </div>
          </form>
          {error.messages.length > 0 && <Error error={error} />}
        </div>
      </div>
      {passwordHasBeenChanged && (
        <div className="flip-card-back">
          <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light lg:mx-4">
            <h3 className="m-4 text-center text-2xl">
              {t("auth:buttons.edit-password")}
            </h3>
            <span className="mt-2 text-center text-xl">
              {t("auth:success")}
            </span>
            <p className="mx-12 my-8 break-words text-center">
              {t("auth:passwordChangedConfirmationMsg")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordForm;
