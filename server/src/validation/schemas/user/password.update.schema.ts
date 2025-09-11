import Joi from "../../../helpers/passwordComplexity.helper";

export default Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.base": "currentPassword must be a string",
    "string.empty": "currentPassword cannot be empty"
  }),
  newPassword: Joi.string().min(12).passwordComplexity().required().messages({
    "string.base": "newPassword must be a string",
    "string.empty": "newPassword cannot be empty",
    "string.min": "newPassword must be at least 12 characters long"
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "confirmNewPassword must match new password"
    })
    .when("newPassword", {
      is: Joi.exist(),
      then: Joi.required()
    })
});
