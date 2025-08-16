import Joi from "joi";

export default Joi.object({
  requestType: Joi.string().max(50).required().messages({
    "string.base": "Front must be a string",
    "string.empty": "Front cannot be empty",
    "string.max": "Front must be at most 50 characters long"
  }),
  subject: Joi.string().max(50).required().messages({
    "string.base": "Back must be a string",
    "string.empty": "Back cannot be empty",
    "string.max": "Back must be at most 50 characters long"
  }),

  email: Joi.when("requestType", {
    is: "PASSWORD_RESET",
    then: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email cannot be empty"
    })
  }),
  otherwise: Joi.forbidden()
});
