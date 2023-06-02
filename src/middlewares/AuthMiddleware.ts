import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
interface IPayload{
  sub: string;
}

class AuthMiddleware {
  auth(request: Request, response: Response, next: NextFunction){
    const authHeaders = request.headers.authorization

    if(!authHeaders){
      return response.status(401).json({
        code: 'token.missing',
        message: 'Token missing',
      });
    }
    
    const [, token] = authHeaders.split(' ');
    let secretKey: string | undefined = process.env.API_SECRET_KEY

    if (!secretKey) {
      throw new Error("There is no token key");
    }
    try {
      const { sub } = verify(token, secretKey) as IPayload;
      request.user_id = sub;
      return next()
    } catch (error) {
      return response.status(401).json({
        code: 'token.expired',
        message: 'token expired',
      })
    }
  }
}

export { AuthMiddleware };