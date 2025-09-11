import { useEffect, useId, useState } from "react";
import axiosInstance from "../../services/axios.instance";
import { AxiosError } from "axios";
import { errorInitialState, onCancelProp } from "../../types/user";
import ChoiceButton from "../../ui/ChoiceButton";
import { ApiErrorResponse } from "../../types/api";
import Error from "../../ui/Error";

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: ""
};

function PasswordForm({ onCancel }: onCancelProp) {
  const [passwordHasBeenChanged, setPasswordHasBeenChanged] = useState(false);
  const cpId = useId();
  const npId = useId();
  const cnpId = useId();
  const [passwordData, setPasswordData] = useState(initialState);
  const [error, setError] = useState(errorInitialState);

  useEffect(() => {
    if (passwordHasBeenChanged) {
      const timeout = setTimeout(() => {
        onCancel();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [passwordHasBeenChanged, onCancel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field !== name),
      messages: prev.messages.filter((message) => !message.includes(name))
    }));

    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFields: string[] = [];
    const newMessages: string[] = [];

    if (!passwordData.currentPassword) {
      newFields.push("currentPassword");
      newMessages.push("currentPassword is required");
    }

    if (!passwordData.newPassword) {
      newFields.push("newPassword");
      newMessages.push("newPassword is required");
    }

    if (!passwordData.confirmNewPassword) {
      newFields.push("confirmNewPassword");
      newMessages.push("confirmNewPassword is required");
    }

    if (newFields.length > 0) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, ...newFields])],
        messages: [...prev.messages, ...newMessages]
      }));
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "newPassword"])],
        messages: [
          ...prev.messages,
          "currentPassword and newPassword are identical"
        ]
      }));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "confirmNewPassword"])],
        messages: [
          ...prev.messages,
          "newPassword and confirmNewPassword are different"
        ]
      }));
      return;
    }

    try {
      await axiosInstance.patch("/profile/changepw", passwordData);
      setPasswordHasBeenChanged(true);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.data.errors) {
        for (const apiError of axiosError.response.data.errors) {
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

  return (
    <div
      className={`flip-card-inner ${passwordHasBeenChanged ? "flip-vertical" : ""}`}
    >
      <div className="flip-card-front">
        <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            Modifier mon mot de passe
          </h3>
          <form
            onSubmit={handleSubmit()}
            className="mx-12 flex flex-1 flex-col justify-center"
          >
            <label htmlFor={cpId} className="ml-1 font-patua text-textPrimary">
              Mot de passe actuel
            </label>
            <input
              id={cpId}
              name="currentPassword"
              type="password"
              className="my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong"
              value={passwordData.currentPassword}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            <label htmlFor={npId} className="ml-1 font-patua text-textPrimary">
              Nouveau mot de passe
            </label>
            <input
              id={npId}
              name="newPassword"
              type="password"
              className="my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong"
              value={passwordData.newPassword}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            <label htmlFor={cnpId} className="ml-1 font-patua text-textPrimary">
              Confirmation de mot de passe
            </label>
            <input
              id={cnpId}
              type="password"
              name="confirmNewPassword"
              className="my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong"
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
              Modifier mon mot de passe
            </h3>
            <span className="mt-2 text-center text-xl">Succès !</span>
            <p className="mx-12 my-8 break-words">
              Votre mot de passe a été modifié !
              <br />
              <br />
              Vous allez recevoir un e-mail de confirmation de modification.
              Vous pouvez dès à présent utiliser votre nouveau mot de passe pour
              vous connecter !
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordForm;
