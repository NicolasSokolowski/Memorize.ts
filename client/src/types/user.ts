export type onCancelProp = {
  onCancel: () => void;
};

export type ErrorType = {
  fields: string[];
  messages: string[];
};

export const errorInitialState: ErrorType = {
  fields: [],
  messages: []
};
