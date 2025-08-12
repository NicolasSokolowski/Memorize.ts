import { useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  checkIfEmailIsAvailable,
  sendVerificationCode
} from "../../store/user/userThunk";

type EditEmailProps = {
  onCancel: () => void;
};

function EmailForm({ onCancel }: EditEmailProps) {
  const [isNewEmailAvailable, setIsNewEmailAvailable] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const dispatch = useAppDispatch();

  const handleCodeChange = (index: number, value: string) => {
    const newChar = value.slice(-1);
    setCode((prev) => {
      const updated = [...prev];
      updated[index] = newChar;
      return updated;
    });
    if (newChar && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            requestType: "email_modification",
            subject: "Modification de votre adresse e-mail"
          })
        );
      } else {
        setError("L'adresse est déjà utilisée.");
      }
      setIsNewEmailAvailable(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flip-card-inner ${isNewEmailAvailable ? "flip-vertical" : ""}`}
    >
      <div className="flip-card-front">
        <div className="mt-4 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-lg">
          <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
            Modifier mon adresse e-mail
          </h3>
          <form
            className="mx-12 flex flex-1 flex-col justify-center"
            onSubmit={handleEmailSubmit}
          >
            <label
              htmlFor="email"
              className="ml-1 font-patua text-xl text-textPrimary"
            >
              Nouvelle adresse e-mail
            </label>
            <input
              id="email"
              type="text"
              className="mt-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
              value={newEmail}
              onChange={(e) => {
                setError("");
                setNewEmail(e.target.value);
              }}
              autoComplete="off"
            />
            <div className="mt-5 flex w-full flex-col justify-center ">
              {error && (
                <div className="pl-3 font-patua text-red-500">{error}</div>
              )}
              <div className="flex w-full justify-center gap-20">
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
            </div>
          </form>
        </div>
      </div>
      {isNewEmailAvailable && (
        <div className="flip-card-back">
          <div
            className={`flip-card-inner--inner ${isCodeValid ? "flip-vertical" : ""}`}
          >
            <div className="flip-card-back-face">
              <div className="mt-4 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-lg">
                <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
                  Modifier mon adresse e-mail
                </h3>
                <form
                  className="mx-12 flex flex-1 flex-col justify-center"
                  onSubmit={handleEmailSubmit}
                >
                  <div className="ml-1 text-center font-patua text-xl text-textPrimary">
                    Veuillez saisir le code reçu sur votre e-mail actuel :
                  </div>
                  <div className="mt-4 flex justify-center gap-2 font-patua">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="h-16 w-12 rounded-lg border border-black text-center text-4xl text-textPrimary shadow-inner-strong"
                      />
                    ))}
                  </div>
                  <div className="mt-5 flex w-full flex-col justify-center ">
                    {error && (
                      <div className="pl-3 font-patua text-red-500">
                        {error}
                      </div>
                    )}
                    <div className="flex w-full justify-center gap-20">
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
                  </div>
                </form>
              </div>
            </div>
            <div className="flip-card-back-of-back">
              <div className="mt-4 flex size-full flex-col rounded-lg bg-tertiary font-patua text-textPrimary shadow-lg">
                <h3 className="m-4 text-center text-2xl">
                  Supprimer mon compte
                </h3>
                <span className="mt-2 text-center text-xl">Succès !</span>
                <p className="mx-12 my-8 break-words text-center">
                  Votre compte a été supprimé.
                  <br />
                  <br />
                  Vous allez recevoir un e-mail de confirmation de suppression.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailForm;
