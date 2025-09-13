import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  ApiErrorResponse,
  checkIfEmailIsAvailable,
  sendVerificationCode
} from "../../store/user/userThunk";
import CodeVerificationForm from "./CodeVerificationForm";
import { errorInitialState, onCancelProp } from "../../types/user";
import ChoiceButton from "../../ui/ChoiceButton";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";

function EmailForm({ onCancel }: onCancelProp) {
  const [isNewEmailAvailable, setIsNewEmailAvailable] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState(errorInitialState);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("auth");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const error = err as ApiErrorResponse;

      if (error.errors) {
        for (const apiError of error.errors) {
          setError((prev) => ({
            ...prev,
            fields: apiError.field
              ? [...new Set([...prev.fields, apiError.field])]
              : prev.fields,
            messages: apiError.message
              ? [...prev.messages, apiError.message]
              : prev.messages
          }));
        }
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
        <div className="relative mb-6 flex  size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            {t("buttons.edit-email")}
          </h3>
          <form
            className="mx-12 flex flex-1 flex-col justify-center"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="email"
              className="ml-1 font-patua text-xl text-textPrimary"
            >
              {t("newEmail")}
            </label>
            <input
              id="email"
              type="text"
              className={`${error.fields?.includes("newEmail") ? "ring-2 ring-error" : ""} mb-5 mt-2 h-12 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
              value={newEmail}
              onChange={(e) => {
                setError(errorInitialState);
                setNewEmail(e.target.value);
              }}
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
                  data={{ newEmail }}
                />
              </div>
            </div>
            <div className="flip-card-back-of-back">
              <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light lg:mx-4">
                <h3 className="m-4 text-center text-2xl">
                  {t("buttons.edit-email")}
                </h3>
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="mt-2 text-center text-xl">
                    {t("success")}
                  </span>
                  <p className="mx-12 my-8 break-words text-center text-lg">
                    {t("emailChangedConfirmationMsg")}
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
