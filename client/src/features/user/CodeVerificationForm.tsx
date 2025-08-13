import { useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { verifyCodeValidity } from "../../store/user/userThunk";

type CodeVerificationProps = {
  onCancel: () => void;
  setIsCodeValid: (valid: boolean) => void;
  newEmail: string;
};

function CodeVerificationForm({
  onCancel,
  setIsCodeValid,
  newEmail
}: CodeVerificationProps) {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
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

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (code.length !== 4) return;

    try {
      const jointCode = code.join("");
      await dispatch(
        verifyCodeValidity({
          requestType: "EMAIL_CHANGE",
          code: jointCode,
          newEmail
        })
      );
      setIsCodeValid(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-lg">
      <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
        Modifier mon adresse e-mail
      </h3>
      <form
        className="mx-12 flex flex-1 flex-col justify-center"
        onSubmit={handleCodeSubmit}
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
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(index, e)}
              className="h-16 w-12 rounded-lg border border-black text-center text-4xl text-textPrimary shadow-inner-strong"
            />
          ))}
        </div>
        <div className="mt-5 flex w-full flex-col justify-center ">
          {error && <div className="pl-3 font-patua text-red-500">{error}</div>}
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
  );
}

export default CodeVerificationForm;
