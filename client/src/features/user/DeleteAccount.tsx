import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setUserNull } from "../../store/user/userSlice";
import CodeVerificationForm from "./CodeVerificationForm";
import { sendVerificationCode } from "../../store/user/userThunk";
import ChoiceButton from "../../ui/ChoiceButton";
import { errorInitialState } from "../../types/user";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../helpers/handleApiError";

type DeleteFormProps = {
  onCancel: () => void;
};

function DeleteAccount({ onCancel }: DeleteFormProps) {
  const [firstConfirmationCheck, setFirstConfirmationCheck] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [disconnectTimer, setDisconnectTimer] = useState(10);
  const [error, setError] = useState(errorInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["auth", "errors"]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        sendVerificationCode({
          requestType: "ACCOUNT_DELETE",
          subject: "Suppression de votre compte"
        })
      ).unwrap();
      setFirstConfirmationCheck(true);
    } catch (err: unknown) {
      const parsedError = handleApiError(err, t);
      setError(parsedError);
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
        <div className="relative mb-6 flex size-full flex-col rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            {t("auth:buttons.delete-user")}
          </h3>
          <div className="mx-12 flex flex-1 flex-col justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <p className="text-center font-patua text-xl text-textPrimary">
                {t("auth:deleteAccountCheck")}
              </p>
              <ChoiceButton width="24" gap="gap-20" onCancel={onCancel} />
            </form>
          </div>
          {error.messages.length > 0 && <Error error={error} />}
        </div>
      </div>
      {firstConfirmationCheck && (
        <div className="flip-card-back">
          <div
            className={`flip-card-inner--inner ${isCodeValid ? "flip-vertical" : ""}`}
          >
            <div className="flip-card-back-face">
              <div className="mb-6 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
                <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
                  {t("auth:buttons.delete-user")}
                </h3>
                <CodeVerificationForm
                  onCancel={onCancel}
                  setIsCodeValid={setIsCodeValid}
                  requestType="ACCOUNT_DELETE"
                />
              </div>
            </div>
            <div className="flip-card-back-of-back">
              <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light lg:mx-4">
                <h3 className="mt-4 text-center text-2xl">
                  {t("auth:buttons.delete-user")}
                </h3>
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="text-center text-xl">
                    {t("auth:success")}
                  </span>
                  <p className="mx-12 my-8 break-words text-center">
                    {t("auth:accountDeletedConfirmationMsg", {
                      count: disconnectTimer
                    })}
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
