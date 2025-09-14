import { AxiosError } from "axios";
import { Namespace, TFunction } from "i18next";
import { ApiErrorResponse } from "../types/api";
import { ParsedError } from "../@types/parsedError";

export function handleApiError<TNS extends Namespace>(
  err: unknown,
  t: TFunction<TNS>
): ParsedError {
  const axiosError = err as AxiosError<ApiErrorResponse>;

  const fields: string[] = [];
  const messages: string[] = [];

  if (axiosError.response?.data.errors) {
    for (const apiError of axiosError.response.data.errors) {
      let message = apiError.message;
      const { label, limit } = apiError.context || {};

      if (apiError.type && apiError.context) {
        const capitalizedLabel = label
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (t(`errors:${label}` as any) as string)
          : undefined;

        message = t(`errors:validation.${apiError.type}`, {
          label: capitalizedLabel,
          limit,
          defaultValue: apiError.message
        }) as string;
      } else if (apiError.code) {
        message = t(`errors:${apiError.code}`, {
          defaultValue: apiError.message
        }) as string;
      }

      if (apiError.field) fields.push(apiError.field);
      if (message) messages.push(message);
    }
  }

  return {
    fields,
    messages
  };
}
