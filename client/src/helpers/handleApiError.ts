/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { Namespace, TFunction } from "i18next";
import { ApiErrorResponse } from "../types/api";
import { ParsedError } from "../@types/parsedError";

export function handleApiError<TNS extends Namespace>(
  err: unknown,
  t: TFunction<TNS>
): ParsedError {
  const fields: string[] = [];
  const messages: string[] = [];

  if ((err as AxiosError<ApiErrorResponse>).isAxiosError) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    if (axiosErr.response?.data.errors) {
      for (const apiError of axiosErr.response.data.errors) {
        let message = apiError.message;
        const { label, limit } = apiError.context || {};

        if (apiError.type && apiError.context) {
          const translatedLabel = label
            ? t(`errors:${label}`, { defaultValue: label })
            : undefined;

          message = t(`errors:validation.${apiError.type}`, {
            label: translatedLabel,
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
  } else if ((err as any)?.errors) {
    const objErr = err as {
      errors: {
        field?: string;
        message: string;
        type?: string;
        context?: any;
        code?: string;
      }[];
    };
    for (const apiError of objErr.errors) {
      let message = apiError.message;
      const { label, limit } = apiError.context || {};

      if (apiError.type && apiError.context) {
        const translatedLabel = label
          ? t(`errors:${label}`, { defaultValue: label })
          : undefined;

        message = t(`errors:validation.${apiError.type}`, {
          label: translatedLabel,
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
  } else {
    messages.push("Unknown error");
  }

  return { fields, messages };
}
