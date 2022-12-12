import { Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export class NotFound extends Error {}
export class RegisterError extends Error {}
export class CredentialsError extends Error {}
export class AuthorizationError extends Error {}

export const sendError = (err: unknown, res: Response) => {
  if (err instanceof NotFound) {
    return res.status(404).json(err.message);
  } else if (err instanceof RegisterError || err instanceof CredentialsError) {
    return res.status(400).json(err.message);
  } else if (err instanceof AuthorizationError) {
    return res.status(401).json(err.message);
  } else {
    return res.status(500).json(err);
  }
};

export const areCredentialsProvided = (params: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      params.forEach((param) => {
        if (!req.body[param]) {
          throw new CredentialsError(
            `Потрібно надати необхідний параметр: ${param}!`
          );
        }
      });

      next();
    } catch (err) {
      sendError(err, res);
    }
  };
};

export const isThereTokenAvailable = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.headers;
    if (!String(token).trim())
      throw new AuthorizationError("Потрібно надати токен доступу!");

    const access_token = String(token).split(" ")[1];

    verify(access_token, process.env.JSON_WEB_TOKEN_SECRET!, (err, payload) => {
      if (err) throw err;
      if (payload) {
        res.locals.user = payload;
        next();
      }
    });
  } catch (err) {
    sendError(err, res);
  }
};
