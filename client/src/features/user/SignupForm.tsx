import { useState } from "react";
import { AxiosError } from "axios";
import axiosInstance from "../../services/axios.instance";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setHasAccount } from "../../store/user/userSlice";
import { ApiErrorResponse } from "../../types/api";
import Error from "../../ui/Error";
import { errorInitialState } from "../../types/user";

const initialState = {
  email: "",
  password: "",
  username: ""
};

function SignupForm() {
  const [userInfo, setUserInfo] = useState(initialState);
  const [error, setError] = useState(errorInitialState);
  const hasAccount = useAppSelector((state) => state.user.hasAccount);
  const dispatch = useAppDispatch();

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/users", userInfo);

      dispatch(setHasAccount(!hasAccount));
      setUserInfo(initialState);
      setError(errorInitialState);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field !== id),
      messages: prev.messages.filter((message) => !message.includes(id))
    }));

    setUserInfo((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(errorInitialState);
    setUserInfo(initialState);
    dispatch(setHasAccount(!hasAccount));
  };

  return (
    <section className="relative min-h-[33rem] overflow-hidden rounded-md bg-tertiary shadow-custom-light transition-all duration-300 xl:min-h-[36rem]">
      <h2 className="m-5 text-center font-patua text-3xl xl:text-4xl">
        Inscription
      </h2>
      <form
        className="flex flex-col items-center justify-center gap-2 p-3 xl:gap-3 xl:p-5"
        onSubmit={handleSubmit()}
      >
        <div className="flex flex-col items-start gap-2">
          <label className="ml-2 font-patua text-xl" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="text"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="Adresse e-mail"
            className={`h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80 ${error.fields.includes("email") ? "ring-2 ring-error" : ""}`}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className="ml-2 font-patua text-xl" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={userInfo.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className={`h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80 ${error.fields.includes("password") ? "ring-2 ring-error" : ""}`}
          />
        </div>

        <div className="flex flex-col items-start gap-1 xl:gap-2">
          <label className="ml-2 font-patua text-xl" htmlFor="username">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={userInfo.username}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
            className={`h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80 ${error.fields.includes("username") ? "ring-2 ring-error" : ""}`}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="mt-5 w-72 rounded-md bg-secondary p-3 shadow-custom-light xl:w-80"
          >
            <span className="rounded-md font-patua text-3xl text-white">
              S'inscrire
            </span>
          </button>
          <div className="flex justify-start">
            <button
              className="font-patua text-sm text-secondary underline underline-offset-2"
              onClick={onClick}
            >
              J'ai déjà un compte
            </button>
          </div>
        </div>
      </form>

      {error.messages.length > 0 && <Error error={error} />}
    </section>
  );
}

export default SignupForm;
