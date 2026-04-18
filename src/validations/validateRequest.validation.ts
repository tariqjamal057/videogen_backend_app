import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { ResponseHandler } from "../handlers/response.handler";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      ResponseHandler.error(res, {
        statusCode: 400,
        msg: messages[0],
        error: messages,
      });
      return;
    }
    next();
  };
};
