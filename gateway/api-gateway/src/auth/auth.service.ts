import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateToken(token: string): { userId: string } {
    if (!token || token !== 'valid-token') {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: 'user-123',
    };
  }
}
