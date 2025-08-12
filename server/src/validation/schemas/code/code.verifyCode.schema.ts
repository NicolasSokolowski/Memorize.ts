import Joi from "joi";

export default Joi.object({
  requestType: Joi.string().max(50).required().messages({
    "string.base": "Front must be a string",
    "string.empty": "Front cannot be empty",
    "string.max": "Front must be at most 50 characters long"
  }),
  code: Joi.string().min(4).max(4).required().messages({
    "string.base": "Back must be a string",
    "string.empty": "Back cannot be empty",
    "string.max": "Back must be 4 characters long"
  }),
  newEmail: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty"
  }),
  subject: Joi.string().max(50).required().messages({
    "string.base": "Back must be a string",
    "string.empty": "Back cannot be empty",
    "string.max": "Back must be at most 50 characters long"
  })
});
