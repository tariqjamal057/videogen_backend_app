import Joi from "joi";

export const basicDetailSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
  }),
  image: Joi.string().optional().allow("", null),
});