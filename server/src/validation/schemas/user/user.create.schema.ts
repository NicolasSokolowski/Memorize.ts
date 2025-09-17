import Joi from "../../../helpers/passwordComplexity.helper";

export default Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "email must be a string",
    "string.email": "email must be a valid email address",
    "string.empty": "email cannot be empty"
  }),
  password: Joi.string().min(12).passwordComplexity().required().messages({
    "string.base": "password must be a string",
    "string.empty": "password cannot be empty",
    "string.min": "password must be at least 12 characters long"
  }),
  username: Joi.string().min(3).max(20).required().messages({
    "string.base": "username must be a string",
    "string.empty": "username cannot be empty",
    "string.min": "username must be at least 3 characters long",
    "string.max": "username must be at most 20 characters long"
  }),
  subject: Joi.string().required().messages({
    "string.base": "subject must be a string",
    "string.empty": "subject cannot be empty"
  })
}).required();
