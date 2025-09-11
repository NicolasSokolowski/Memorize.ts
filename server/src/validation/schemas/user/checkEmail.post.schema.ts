import Joi from "joi";

export default Joi.object({
  newEmail: Joi.string().email().required().messages({
    "string.base": "email must be a string",
    "string.email": "email must be a valid email address",
    "string.empty": "email cannot be empty"
  })
});
