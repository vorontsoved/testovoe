import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from 'src/exceptions/api-error';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/news/readNews' && req.method === 'GET') {
      return next();
    }
    try {
        
      const authorization = req.headers.authorization;
      const accessToken = authorization?.split(' ')[1];
      if (!accessToken) {
        return next(ApiError.UnauthorizedError());
      }
      const userData = UsersService.validateAccessToken(accessToken);

      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }
      req.body.user = userData;
      next();
    } catch (error) {
      return next(ApiError.UnauthorizedError());
    }
  }
}
