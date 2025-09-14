import { ChangeEvent } from "react";
import { ParsedError } from "../@types/parsedError";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function createHandleChange<T>(
  setValue: SetState<T>,
  setError: SetState<ParsedError>
) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setError((prev) => ({
      fields: prev.fields.filter((field) => field !== id),
      messages: prev.messages.filter((_, i) => prev.fields[i] !== id)
    }));

    setValue((prev) => ({
      ...prev,
      [id]: value
    }));
  };
}
