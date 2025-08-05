import { useState } from "react";
import axiosInstance from "../../services/axios.instance";
import axios from "axios";

type PasswordFormProps = {
  onCancel: () => void;
};

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: ""
};

function PasswordForm({ onCancel }: PasswordFormProps) {
  const [passwordData, setPasswordData] = useState(initialState);
  const [error, setError] = useState({
    message: ""
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
      onCancel();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        setError({ message: err.response.data.errors[0].message });
      }
    }
  };

  return (
    <>
      <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
        Modifier mon mot de passe
      </h3>
      <form
        onSubmit={handleSubmit()}
        className="mx-12 flex flex-1 flex-col justify-center"
      >
        <label
          htmlFor="currentPassword"
          className="ml-1 font-patua text-textPrimary"
        >
          Mot de passe actuel
        </label>
        <input
          id="currentPassword"
          type="password"
          className="my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong"
          value={passwordData.currentPassword}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        <label
          htmlFor="newPassword"
          className="ml-1 font-patua text-textPrimary"
        >
          Nouveau mot de passe
        </label>
        <input
          id="newPassword"
          type="password"
          className="my-2 h-8 rounded-lg pl-3 font-patua text-sm text-textPrimary shadow-inner-strong"
          value={passwordData.newPassword}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        <label
          htmlFor="confirmNewPassword"
          className="ml-1 font-patua text-textPrimary"
        >
          Confirmation de mot de passe
        </label>
        <input
          id="confirmNewPassword"
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
          <div className="flex w-full justify-center gap-20">
            <button type="button">
              <img
                src="/cancelation.png"
                alt="Cancelation icon"
                onClick={onCancel}
                className="w-20"
                draggable={false}
              />
            </button>
            <button type="submit" className="mr-2">
              <img
                src="/validation.png"
                alt="Validation icon"
                className="w-16"
                draggable={false}
              />
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default PasswordForm;
