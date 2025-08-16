import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios.instance";
import axios from "axios";

type PasswordResetProps = {
  onCancel: () => void;
};

function PasswordResetForm({ onCancel }: PasswordResetProps) {
  const [passwordHasBeenChanged, setPasswordHasBeenChanged] = useState(false);
  const [newPassword, setNewPassword] = useState({
    newPassword: "",
    passwordConfirmation: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (passwordHasBeenChanged) {
      setTimeout(() => {
        onCancel();
      }, 5000);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError("");

    setNewPassword((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPassword.newPassword || !newPassword.passwordConfirmation) {
      setError("Tous les champs sont requis.");
    } else if (newPassword.newPassword !== newPassword.passwordConfirmation) {
      setError("Les mots de passe sont différent");
    }

    try {
      await axiosInstance.patch("/profile/resetpw", newPassword);
      setPasswordHasBeenChanged(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        setError(err.response.data.errors[0].message);
      }
    }
  };

  return (
    <form
      className="mt-8 flex flex-1 flex-col justify-center"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="new-pw"
        className="ml-1 font-patua text-xl text-textPrimary"
      >
        Nouveau mot de passe
      </label>
      <input
        id="newPassword"
        type="password"
        className="my-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
        value={newPassword.newPassword}
        onChange={(e) => handleChange(e)}
        autoComplete="off"
      />
      <label
        htmlFor="passwordConfirmation"
        className="ml-1 font-patua text-xl text-textPrimary"
      >
        Confirmation mot de passe
      </label>
      <input
        id="passwordConfirmation"
        type="password"
        className="my-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
        value={newPassword.passwordConfirmation}
        onChange={(e) => handleChange(e)}
        autoComplete="off"
      />
      {error ? (
        <p className="break-words pl-2 font-patua text-red-500">{error}</p>
      ) : (
        <div className="">
          {!passwordHasBeenChanged ? (
            <div className="mt-5 flex h-24 w-full justify-center gap-20">
              <button type="button">
                <img
                  src="/cancelation.png"
                  alt="Cancelation icon"
                  onClick={onCancel}
                  className="w-24"
                  draggable={false}
                />
              </button>
              <button type="submit" className="mr-2">
                <img
                  src="/validation.png"
                  alt="Validation icon"
                  className="w-20"
                  draggable={false}
                />
              </button>
            </div>
          ) : (
            <div className="mt-5 flex h-24 flex-col items-center justify-end">
              <p className="mt-4 text-center font-patua text-base text-textPrimary">
                Succès : Un e-mail de confirmation vous a été envoyé. Vous
                pouvez dès à pouvez dès à présent vous connecter avec votre
                nouveau mot de passe.
              </p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

export default PasswordResetForm;
