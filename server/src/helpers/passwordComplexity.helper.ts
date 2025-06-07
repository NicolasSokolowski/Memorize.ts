import Joi, { CustomHelpers, ExtensionFactory } from "joi";

const passwordComplexity: ExtensionFactory = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.passwordComplexity":
      "{{#label}} must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
  },

  rules: {
    passwordComplexity: {
      validate(value: string, helpers: CustomHelpers<string>) {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasDigit = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

        if (!(hasUpperCase && hasLowercase && hasDigit && hasSpecial)) {
          return helpers.error("string.passwordComplexity");
        }

        return value;
      }
    }
  }
});

const extendedJoi = Joi.extend(passwordComplexity);

export default extendedJoi;
