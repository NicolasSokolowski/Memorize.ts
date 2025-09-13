/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiErrorItem {
  message: string;
  field?: string;
  type?: string;
  context?: Record<string, any>;
  code?: string;
}

export interface ApiErrorResponse {
  errors: ApiErrorItem[];
}
