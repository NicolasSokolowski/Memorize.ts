import Joi from "joi";

export default Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.base": "name must be a string",
    "string.empty": "name cannot be empty",
    "string.max": "name must be at most 50 characters long"
  })
});
