import Joi from "joi";

export const verifyCodeSchema = Joi.object({
  requestType: Joi.string().max(50).required(),
  code: Joi.string().length(4).required(),

  newEmail: Joi.when("requestType", {
    is: "EMAIL_CHANGE",
    then: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email cannot be empty"
    }),
    otherwise: Joi.forbidden()
  })
});
