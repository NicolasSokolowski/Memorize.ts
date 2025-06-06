import Joi from "../../../helpers/passwordComplexity.helper";

export default Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty",
  }),
  password: Joi.string().min(12).passwordComplexity().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 12 characters long",
  }),
  username: Joi.string().min(3).max(20).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 20 characters long",
  }),
});
