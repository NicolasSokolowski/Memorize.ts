import { useEffect, useId, useState } from "react";
import axiosInstance from "../../services/axios.instance";
import axios from "axios";
import { onCancelProp } from "../../types/user";
import ChoiceButton from "../../ui/ChoiceButton";

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
  const [error, setError] = useState({
    message: ""
  });

  useEffect(() => {
    if (passwordHasBeenChanged) {
      setTimeout(() => {
        onCancel();
      }, 5000);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      ...prev,
      message: ""
    }));

    setPasswordData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      setError({ message: "Veuillez remplir tous les champs." });
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError({ message: "Le mot de passe est identique au précédent." });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError({ message: "Les mots de passe sont différents." });
      return;
    }

    try {
      await axiosInstance.patch("/profile/changepw", passwordData);
      setPasswordHasBeenChanged(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        setError({ message: err.response.data.errors[0].message });
      }
    }
  };

  return (
    <div
      className={`flip-card-inner ${passwordHasBeenChanged ? "flip-vertical" : ""}`}
    >
      <div className="flip-card-front">
        <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary shadow-custom-light sm:mx-4">
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
              className="my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong"
              value={passwordData.confirmNewPassword}
              onChange={(e) => handleChange(e)}
              autoComplete="off"
            />
            {error.message ? (
              <p className="break-words pl-2 font-patua text-red-500">
                {error.message}
              </p>
            ) : (
              <ChoiceButton width="20" gap="gap-20" onCancel={onCancel} />
            )}
          </form>
        </div>
      </div>
      {passwordHasBeenChanged && (
        <div className="flip-card-back">
          <div className="mb-6 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-custom-light sm:mx-4">
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
