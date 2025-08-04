import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserInfos } from "../../store/user/userThunk";
import { ApiErrorResponse } from "../../helpers/interfaces";

type UsernameFormProps = {
  onCancel: () => void;
};

function UsernameForm({ onCancel }: UsernameFormProps) {
  const [usernameEdited, setUsernameEdited] = useState("");
  const [error, setError] = useState({
    message: ""
  });
  const username = useAppSelector((state) => state.user.user?.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (username) {
      setUsernameEdited(username);
    }
  }, [username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({ message: "" });
    setUsernameEdited(e.target.value);
  };

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usernameEdited) return;

    if (username === usernameEdited) {
      setError({ message: "Le nom est identique au précédent." });
      return;
    }

    try {
      await dispatch(updateUserInfos({ username: usernameEdited })).unwrap();
      onCancel();
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;

      if (error.errors) {
        for (const e of error.errors) {
          setError((prev) => ({ ...prev, message: e.message }));
        }
      }
    }
  };

  return (
    <>
      <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
        Modifier mon nom
      </h3>
      <form
        onSubmit={handleSubmit()}
        className="mx-12 flex flex-1 flex-col justify-center"
      >
        <label
          htmlFor="username"
          className="ml-1 font-patua text-xl text-textPrimary"
        >
          Nom d'utilisateur
        </label>
        <input
          id="username"
          type="text"
          className="my-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
          value={usernameEdited}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        {error.message && (
          <p className="break-words pl-2 font-patua text-red-500">
            {error.message}
          </p>
        )}
        <div className="mt-5 flex w-full justify-center gap-20">
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
      </form>
    </>
  );
}

export default UsernameForm;
