import Joi from "joi";

export default Joi.object({
  front: Joi.string().max(100).required().messages({
    "string.base": "Front must be a string",
    "string.empty": "Front cannot be empty",
    "string.max": "Front must be at most 100 characters long"
  }),
  back: Joi.string().max(100).required().messages({
    "string.base": "Back must be a string",
    "string.empty": "Back cannot be empty",
    "string.max": "Back must be at most 100 characters long"
  })
});
