import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserInfos } from "../../store/user/userThunk";
import { errorInitialState, onCancelProp } from "../../types/user";
import ChoiceButton from "../../ui/ChoiceButton";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../helpers/handleApiError";
import { createHandleChange } from "../../helpers/createHandleChange";

const initialState = {
  username: ""
};

function UsernameForm({ onCancel }: onCancelProp) {
  const [user, setUser] = useState(initialState);
  const [error, setError] = useState(errorInitialState);
  const username = useAppSelector((state) => state.user.user?.username);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["auth", "errors"]);

  const handleChange = createHandleChange(setUser, setError);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.username) {
      setError({
        ...error,
        fields: [...error.fields, "username"],
        messages: [
          ...error.messages,
          t("errors:validation.string.empty", { label: t("errors:username") })
        ]
      });
      return;
    }

    if (username === user.username) {
      setError({
        ...error,
        fields: [...error.fields, "username"],
        messages: [
          ...error.messages,
          t("errors:validation.noChange", { label: t("errors:username") })
        ]
      });
      return;
    }

    try {
      await dispatch(updateUserInfos({ username: user.username })).unwrap();
      onCancel();
    } catch (err: unknown) {
      const parsedError = handleApiError(err, t);
      setError(parsedError);
    }
  };

  return (
    <div className="mb-6 flex  size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
      <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
        {t("auth:buttons.edit-username")}
      </h3>
      <form
        onSubmit={handleSubmit()}
        className="mx-12 flex flex-1 flex-col justify-center"
      >
        <label
          htmlFor="username"
          className="ml-1 font-patua text-xl text-textPrimary"
        >
          {t("auth:newUsername")}
        </label>
        <input
          id="username"
          type="text"
          className={`${error.fields?.includes("username") ? "ring-2 ring-error" : ""} mb-5 mt-2 h-12 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
          value={user.username}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
        <div className="h-24">
          <div className={`${error.messages.length > 0 && "hidden"}`}>
            <ChoiceButton width="24" gap="gap-20" onCancel={onCancel} />
          </div>
        </div>
      </form>
      {error.messages.length > 0 && <Error error={error} />}
    </div>
  );
}

export default UsernameForm;
