import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/user/userThunk";
import { setHasAccount } from "../../store/user/userSlice";

const initialState = {
  email: "",
  password: ""
};

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

function LoginForm() {
  const [userInfo, setUserInfo] = useState(initialState);
  const [error, setError] = useState({
    message: ""
  });
  const hasAccount = useAppSelector((state) => state.user.hasAccount);
  const dispatch = useAppDispatch();

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(login(userInfo)).unwrap();

      setUserInfo(initialState);
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;

      if (error.errors) {
        for (const e of error.errors) {
          setError((prev) => ({ ...prev, message: e.message }));
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
      message: ""
    }));

    setUserInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setError({
      message: ""
    });

    setUserInfo(initialState);

    dispatch(setHasAccount(!hasAccount));
  };

  return (
    <section className="h-full min-h-[36rem] w-100 overflow-hidden rounded-md border-gray-300 bg-white shadow-xl">
      <h2 className="m-5 text-center font-patua text-4xl text-textPrimary">
        Connexion
      </h2>
      <form
        className="flex h-112 flex-col items-center justify-center gap-6 p-5"
        onSubmit={handleSubmit()}
      >
        <div className="flex flex-col items-start gap-2">
          <label
            className="font-patua text-xl text-textPrimary"
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
            className="h-12 w-80 rounded-md border-gray-300 bg-tertiary p-2 pl-3 font-patua text-textPrimary shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
          />
        </div>
        <div className="flex w-80 flex-col items-start gap-2">
          <label
            className="font-patua text-xl text-textPrimary"
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
            className="h-12 w-80 rounded-md border-gray-300 bg-tertiary p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
          />
          {error.message ? (
            <p className="mt-1 h-2 max-w-full break-words font-patua text-red-500">
              {error.message}
            </p>
          ) : (
            <p className="mt-1 h-2" />
          )}
        </div>
        <div className="flex w-80 flex-col gap-3">
          <button
            type="submit"
            className="mt-5 w-80 rounded-md bg-secondary p-3 shadow-xl"
          >
            <span className="rounded-md font-patua text-3xl text-white">
              Connexion
            </span>
          </button>
          <div className="flex justify-between">
            <button
              className="font-patua text-sm text-secondary underline underline-offset-2"
              onClick={onClick}
            >
              Je n'ai pas de compte
            </button>
            <button className="font-patua text-sm text-secondary underline underline-offset-2">
              Mot de passe oublié ?
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default LoginForm;
