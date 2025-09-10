import Joi from "joi";

export default Joi.object({
  email: Joi.string().email().messages({
    "string.base": "email must be a string",
    "string.email": "email must be a valid email address",
    "string.empty": "email cannot be empty"
  }),
  username: Joi.string().min(3).max(20).messages({
    "string.base": "username must be a string",
    "string.empty": "username cannot be empty",
    "string.min": "username must be at least 3 characters long",
    "string.max": "username must be at most 20 characters long"
  })
})
  .min(1)
  .messages({
    "object.min": "At least one field (email or username) must be provided"
  });
