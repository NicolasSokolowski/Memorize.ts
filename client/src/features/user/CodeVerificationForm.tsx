import { useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { verifyCodeValidity } from "../../store/user/userThunk";
import { ApiErrorResponse } from "../../helpers/interfaces";

type CodeVerificationProps = {
  onCancel: () => void;
  setIsCodeValid: (valid: boolean) => void;
} & {
  requestType: "EMAIL_CHANGE";
  data: { newEmail: string };
};

function CodeVerificationForm({
  onCancel,
  setIsCodeValid,
  requestType,
  data
}: CodeVerificationProps) {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleCodeChange = (index: number, value: string) => {
    setError("");
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
          requestType,
          code: jointCode,
          data
        })
      ).unwrap();

      setIsCodeValid(true);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      if (apiError?.errors?.length) {
        setError(apiError.errors[0].message);
      }
    }
  };

  return (
    <form
      className="mx-12 flex flex-1 flex-col justify-center"
      onSubmit={handleCodeSubmit}
    >
      <div className="ml-1 text-center font-patua text-xl text-textPrimary">
        Veuillez saisir le code reçu sur votre e-mail :
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
      <div className="mt-5 flex w-full flex-col justify-center text-center ">
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
  );
}

export default CodeVerificationForm;
