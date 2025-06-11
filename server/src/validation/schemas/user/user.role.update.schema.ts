import Joi from "joi";

export default Joi.object({
  name: Joi.string().min(3).max(15).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be at most 15 characters long"
  })
});
