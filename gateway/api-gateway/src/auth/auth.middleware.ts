import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as passport from 'passport';

interface User {
  userId?: string;
  sub?: string;
  email?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const handler = passport.authenticate(
      'jwt',
      { session: false },
      (err: any, user: User, info: any) => {
        if (err || !user) {
          throw new UnauthorizedException(
            (info as { message?: string })?.message || 'Unauthorized',
          );
        }
        (req as unknown as { user: User }).user = user;

        // Also set x-user-id for downstream services
        const userId = user.userId || user.sub;
        if (userId) {
          req.headers['x-user-id'] = userId;
        }
        next();
      },
    ) as unknown as RequestHandler;
    handler(req, res, next);
  }
}
