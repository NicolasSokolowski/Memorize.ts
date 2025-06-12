import Joi from "joi";

export default Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.max": "Name must be at most 50 characters long"
  })
});
