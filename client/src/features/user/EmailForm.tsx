import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  checkIfEmailIsAvailable,
  sendVerificationCode
} from "../../store/user/userThunk";
import CodeVerificationForm from "./CodeVerificationForm";
import { errorInitialState, onCancelProp } from "../../types/user";
import ChoiceButton from "../../ui/ChoiceButton";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../helpers/handleApiError";
import { createHandleChange } from "../../helpers/createHandleChange";

const initialState = {
  newEmail: ""
};

function EmailForm({ onCancel }: onCancelProp) {
  const [user, setUser] = useState(initialState);
  const [isNewEmailAvailable, setIsNewEmailAvailable] = useState(false);
  const [error, setError] = useState(errorInitialState);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const dispatch = useAppDispatch();
  const currentEmail = useAppSelector((state) => state.user.user?.email);
  const { t } = useTranslation(["auth", "errors"]);

  const handleChange = createHandleChange(setUser, setError);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.newEmail) {
      setError({
        ...error,
        fields: [...error.fields, "newEmail"],
        messages: [
          ...error.messages,
          t("errors:validation.string.empty", { label: t("errors:newEmail") })
        ]
      });
      return;
    }

    if (currentEmail === user.newEmail) {
      setError({
        ...error,
        fields: [...error.fields, "newEmail"],
        messages: [
          ...error.messages,
          t("errors:validation.noChange", {
            label: t("errors:email")
          })
        ]
      });
      return;
    }

    try {
      const response = await dispatch(
        checkIfEmailIsAvailable({ newEmail: user.newEmail })
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
      const parsedError = handleApiError(err, t);
      setError(parsedError);
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
        <div className="relative mb-6 flex  size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            {t("auth:buttons.edit-email")}
          </h3>
          <form
            className="mx-12 flex flex-1 flex-col justify-center"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="newEmail"
              className="ml-1 font-patua text-xl text-textPrimary"
            >
              {t("auth:newEmail")}
            </label>
            <input
              id="newEmail"
              type="text"
              className={`${error.fields?.includes("newEmail") ? "ring-2 ring-error" : ""} mb-5 mt-2 h-12 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
              value={user.newEmail}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            <div className="h-24">
              <div className={`${error.messages.length > 0 && "hidden"}`}>
                <ChoiceButton width="24" gap="gap-20" onCancel={onCancel} />
              </div>
            </div>
          </form>
          {error.messages.length > 0 && <Error error={error} />}
        </div>
      </div>
      {isNewEmailAvailable && (
        <div className="flip-card-back">
          <div
            className={`flip-card-inner--inner ${isCodeValid ? "flip-vertical" : ""}`}
          >
            <div className="flip-card-back-face">
              <div className="mb-6 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
                <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
                  {t("buttons.edit-email")}
                </h3>
                <CodeVerificationForm
                  onCancel={onCancel}
                  setIsCodeValid={setIsCodeValid}
                  requestType="EMAIL_CHANGE"
                  data={{ newEmail: user.newEmail }}
                />
              </div>
            </div>
            <div className="flip-card-back-of-back">
              <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light lg:mx-4">
                <h3 className="m-4 text-center text-2xl">
                  {t("auth:buttons.edit-email")}
                </h3>
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="mt-2 text-center text-xl">
                    {t("auth:success")}
                  </span>
                  <p className="mx-12 my-8 break-words text-center text-lg">
                    {t("auth:emailChangedConfirmationMsg")}
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
