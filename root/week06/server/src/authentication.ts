import jwt from "jsonwebtoken";
import { Request } from "express";
import { errors } from "./errors";

export function expressAuthentication(request: Request, securityName: string): Promise<any> {
  if (securityName === "jwt") {
    const token = request.headers.authorization?.split(" ")[1];

    return new Promise((resolve, reject) => {
      if (!token) return reject(errors.UNAUTHORIZED);

      jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) return reject(errors.INVALID_TOKEN);
        resolve(decoded);
      });
    });
  }
  return Promise.reject(errors.UNAUTHORIZED);
}