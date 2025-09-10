import Joi from "joi";

export default Joi.object({
  front: Joi.string().max(100).required().messages({
    "string.base": "front must be a string",
    "string.empty": "front cannot be empty",
    "string.max": "front must be at most 100 characters long"
  }),
  back: Joi.string().max(100).required().messages({
    "string.base": "back must be a string",
    "string.empty": "back cannot be empty",
    "string.max": "back must be at most 100 characters long"
  })
});
