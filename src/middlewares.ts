import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { AnyZodObject, ZodError } from "zod";

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.statusCode === 200) {
    res.status(500);
  }

  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? {} : error.stack,
  });
};

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      res.status(400);
      return next(new Error(JSON.stringify(error.format())));
    }
  };
