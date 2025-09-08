import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/user/userThunk";
import { setHasAccount } from "../../store/user/userSlice";
import PasswordReset from "./PasswordReset";
import { ApiErrorResponse } from "../../types/api";

const initialState = {
  email: "",
  password: ""
};

type SigninErrorType = {
  fields: string[];
  messages: string[];
};

const errorInitialState: SigninErrorType = {
  fields: [],
  messages: []
};

function LoginForm() {
  const [userInfo, setUserInfo] = useState(initialState);
  const [activeAction, setActiveAction] = useState<Action>("none");
  const [visibleAction, setVisibleAction] = useState<Action>("none");
  const [error, setError] = useState(errorInitialState);
  const [errorMsgIndex, setErrorMsgIndex] = useState(0);
  const [msgHeight, setMsgHeight] = useState(0);
  const msgRef = useRef<HTMLParagraphElement>(null);
  const hasAccount = useAppSelector((state) => state.user.hasAccount);
  const dispatch = useAppDispatch();

  const onCancel = () => {
    setActiveAction("none");
  };

  type Action = "none" | "reset-password";

  useEffect(() => {
    if (error.messages.length > 0) {
      const timeout = setTimeout(() => {
        setErrorMsgIndex((prev) =>
          prev < error.messages.length - 1 ? prev + 1 : 0
        );
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [errorMsgIndex, error.messages]);

  useEffect(() => {
    if (msgRef.current) {
      setMsgHeight(msgRef.current.offsetHeight);
    }
  }, [errorMsgIndex, error.messages]);

  useEffect(() => {
    if (activeAction === "none") {
      const timeout = setTimeout(() => {
        setVisibleAction("none");
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setVisibleAction(activeAction);
    }
  }, [activeAction]);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(login(userInfo)).unwrap();

      setUserInfo(initialState);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Create an object from the form's id to map to the state keys
    const fieldMap: Record<string, keyof typeof initialState> = {
      "email-log": "email",
      "password-log": "password"
    };

    const field = fieldMap[id];

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f !== field),
      messages: prev.messages.filter((message) => !message.includes(field))
    }));

    setUserInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setError(errorInitialState);
    setUserInfo(initialState);

    dispatch(setHasAccount(!hasAccount));
  };

  return (
    <div
      className={`flip-card-inner relative ${activeAction === "reset-password" ? "flip-vertical-reverse" : ""}`}
    >
      <div className="flip-card-front">
        <section className="min-h-[33rem] overflow-hidden rounded-md border-gray-300 bg-tertiary shadow-custom-light xl:min-h-[36rem]">
          <h2 className="m-5 text-center font-patua text-3xl text-textPrimary xl:text-4xl">
            Connexion
          </h2>
          <form
            className="flex flex-col items-center justify-center gap-4 p-3 xl:gap-6 xl:p-5"
            onSubmit={handleSubmit()}
          >
            <div className="flex flex-col items-start gap-2">
              <label
                className="ml-2 font-patua text-xl text-textPrimary"
                htmlFor="email-log"
              >
                E-mail
              </label>
              <input
                id="email-log"
                type="text"
                value={userInfo.email}
                onChange={(e) => handleChange(e)}
                placeholder="Adresse e-mail"
                className="h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 font-patua text-textPrimary shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <label
                className="ml-2 font-patua text-xl text-textPrimary"
                htmlFor="password-log"
              >
                Mot de passe
              </label>
              <input
                id="password-log"
                type="password"
                value={userInfo.password}
                onChange={(e) => handleChange(e)}
                placeholder="Mot de passe"
                className="h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80"
              />
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="mt-5 w-72 rounded-md bg-secondary p-3 shadow-custom-light xl:w-80"
              >
                <span className="rounded-md font-patua text-3xl text-white">
                  Connexion
                </span>
              </button>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="font-patua text-sm text-secondary underline underline-offset-2"
                  onClick={onClick}
                >
                  Je n'ai pas de compte
                </button>
                <button
                  type="button"
                  className="font-patua text-sm text-secondary underline underline-offset-2"
                  onClick={() => {
                    setActiveAction("reset-password");
                    setUserInfo(initialState);
                  }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>
          </form>
          {error.messages.length > 0 && (
            <div
              className="absolute bottom-0 w-full overflow-hidden rounded-b-md bg-error transition-all duration-500 ease-in-out"
              style={{ height: msgHeight }}
            >
              <p
                ref={msgRef}
                className="px-3 py-2 text-center font-patua text-sm text-white text-opacity-85"
              >
                {error.messages[errorMsgIndex]}
              </p>
            </div>
          )}
        </section>
      </div>
      {visibleAction === "reset-password" && (
        <div className="flip-card-back">
          <PasswordReset onCancel={onCancel} />
        </div>
      )}
    </div>
  );
}

export default LoginForm;
