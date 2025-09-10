import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserInfos } from "../../store/user/userThunk";
import { errorInitialState, onCancelProp } from "../../types/user";
import { ApiErrorResponse } from "../../types/api";
import ChoiceButton from "../../ui/ChoiceButton";
import Error from "../../ui/Error";

function UsernameForm({ onCancel }: onCancelProp) {
  const [usernameEdited, setUsernameEdited] = useState("");
  const [error, setError] = useState(errorInitialState);
  const username = useAppSelector((state) => state.user.user?.username);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field !== id),
      messages: prev.messages.filter((message) => !message.includes(id))
    }));

    setUsernameEdited(value);
  };

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usernameEdited) return;

    if (!usernameEdited) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "username"])],
        messages: [...prev.messages, "username is required"]
      }));
      return;
    }

    if (username === usernameEdited) {
      setError((prev) => ({
        ...prev,
        fields: [...new Set([...prev.fields, "username"])],
        messages: [
          ...prev.messages,
          "username is identical to the previous one"
        ]
      }));
      return;
    }

    try {
      await dispatch(updateUserInfos({ username: usernameEdited })).unwrap();
      onCancel();
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;

      if (apiError.errors) {
        for (const e of apiError.errors) {
          setError((prev) => ({
            ...prev,
            fields: e.field
              ? [...new Set([...prev.fields, e.field])]
              : prev.fields,
            messages: e.message ? [...prev.messages, e.message] : prev.messages
          }));
        }
      }
    }
  };

  return (
    <div className="mb-6 flex  size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
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
          Nouveau nom d'utilisateur
        </label>
        <input
          id="username"
          type="text"
          className={`${error.fields?.includes("username") ? "ring-2 ring-error" : ""} mb-5 mt-2 h-12 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong focus:outline-none focus:ring-2 focus:ring-primary`}
          value={usernameEdited}
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
