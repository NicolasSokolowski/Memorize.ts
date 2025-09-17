import Joi from "../../../helpers/passwordComplexity.helper";

export default Joi.object({
  newPassword: Joi.string().min(12).passwordComplexity().required().messages({
    "string.base": "newPassword must be a string",
    "string.empty": "newPassword cannot be empty",
    "string.min": "newPassword must be at least 12 characters long"
  }),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "passwordConfirmation must match new password"
    })
    .when("newPassword", {
      is: Joi.exist(),
      then: Joi.required()
    }),
  subject: Joi.string().required().messages({
    "string.base": "subject must be a string",
    "string.empty": "subject cannot be empty"
  }),
  object: Joi.string().required().messages({
    "string.base": "object must be a string",
    "string.empty": "object cannot be empty"
  })
}).required();
