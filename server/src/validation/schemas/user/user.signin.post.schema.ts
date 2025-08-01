import Joi from "joi";

export default Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty"
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string"
  })
});
