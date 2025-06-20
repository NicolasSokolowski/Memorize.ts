import Joi from "joi";

const cardSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Card ID must be a number",
    "number.empty": "Card ID cannot be empty"
  }),
  user_answer: Joi.string()
    .valid("easy", "medium", "hard")
    .required()
    .messages({
      "any.only": 'User answer must be one of "easy", "medium", or "hard"',
      "string.base": "User answer must be a string",
      "string.empty": "User answer cannot be empty"
    })
});

const cardsArraySchema = Joi.array().items(cardSchema);

export default cardsArraySchema;
