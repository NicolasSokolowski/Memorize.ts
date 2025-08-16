import { useState } from "react";
import CodeVerificationForm from "./CodeVerificationForm";

type PasswordResetProps = {
  onCancel: () => void;
};

function PasswordReset({ onCancel }: PasswordResetProps) {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [error, setError] = useState({
    message: ""
  });

  return (
    <div className="flex size-full h-144 flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-lg">
      <h3 className="m-4 text-center text-2xl">
        Réinitialisation du mot de passe
      </h3>
      <form className="mx-12 mt-8 flex h-20 flex-1 flex-col">
        <label
          htmlFor="email"
          className="ml-1 font-patua text-xl text-textPrimary"
        >
          Adresse e-mail
        </label>
        <input
          id="email"
          type="text"
          className="mt-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
          value={email}
          onChange={(e) => {
            setError({ message: "" });
            setEmail(e.target.value);
          }}
          autoComplete="off"
        />
        {!emailHasBeenSent ? (
          <div className="mt-5 flex w-full flex-col justify-center ">
            <div className="flex w-full justify-center gap-20">
              <button type="button">
                <img
                  src="/cancelation.png"
                  alt="Cancelation icon"
                  onClick={() => {
                    onCancel();
                    setTimeout(() => {
                      setEmailHasBeenSent(false);
                    }, 800);
                  }}
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
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center">
            {!isCodeValid ? (
              <CodeVerificationForm
                onCancel={onCancel}
                setIsCodeValid={setIsCodeValid}
                requestType="PASSWORD_RESET"
              />
            ) : (
              <p>Hello</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default PasswordReset;
