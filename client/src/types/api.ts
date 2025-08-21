export interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}
