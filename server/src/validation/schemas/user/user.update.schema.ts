import Joi from "joi";

export default Joi.object({
  email: Joi.string().email().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty"
  }),
  username: Joi.string().min(3).max(20).messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 20 characters long"
  })
})
  .min(1)
  .messages({
    "object.min": "At least one field (email or username) must be provided"
  });
