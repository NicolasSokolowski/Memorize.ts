import { useState } from "react";
import axiosInstance from "../../services/axios.instance";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setHasAccount } from "../../store/user/userSlice";
import Error from "../../ui/Error";
import { errorInitialState } from "../../types/user";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../helpers/handleApiError";

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

  const { t } = useTranslation(["auth", "errors"]);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/users", userInfo);

      dispatch(setHasAccount(!hasAccount));
      setUserInfo(initialState);
      setError(errorInitialState);
    } catch (err: unknown) {
      const parsedError = handleApiError(err, t);
      setError(parsedError);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field !== id),
      messages: prev.messages.filter(
        (message) =>
          !message.includes(id.charAt(0).toUpperCase() + message.slice(1))
      )
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
    <section className="relative min-h-[33rem] overflow-hidden rounded-md bg-tertiary font-patua text-textPrimary shadow-custom-light transition-all duration-300 xl:min-h-[36rem]">
      <h2 className="m-5 text-center text-3xl xl:text-4xl">{t("register")}</h2>
      <form
        className="flex flex-col items-center justify-center gap-2 p-3 xl:gap-3 xl:p-5"
        onSubmit={handleSubmit()}
      >
        <div className="flex flex-col items-start gap-2">
          <label className="ml-2 text-xl" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="text"
            value={userInfo.email}
            onChange={handleChange}
            className={`h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80 ${error.fields.includes("email") ? "ring-2 ring-error" : ""} text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary`}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className="ml-2 text-xl" htmlFor="password">
            {t("auth:password")}
          </label>
          <input
            id="password"
            type="password"
            value={userInfo.password}
            onChange={handleChange}
            className={`h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80 ${error.fields.includes("password") ? "ring-2 ring-error" : ""} text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary`}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col items-start gap-1 xl:gap-2">
          <label className="ml-2 text-xl" htmlFor="username">
            {t("auth:username")}
          </label>
          <input
            id="username"
            type="text"
            value={userInfo.username}
            onChange={handleChange}
            className={`h-12 w-72 rounded-md border-gray-300 bg-white p-2 pl-3 text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70 xl:w-80 ${error.fields.includes("username") ? "ring-2 ring-error" : ""} text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary`}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="mt-5 w-72 rounded-md bg-secondary p-3 shadow-custom-light xl:w-80"
          >
            <span className="rounded-md text-3xl text-white">
              {t("auth:buttons.signup")}
            </span>
          </button>
          <div className="flex justify-start">
            <button
              className="text-sm text-secondary underline underline-offset-2"
              onClick={onClick}
            >
              {t("hasAccount")}
            </button>
          </div>
        </div>
      </form>

      {error.messages.length > 0 && <Error error={error} />}
    </section>
  );
}

export default SignupForm;
