import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const request = req as Request;
    const tracker =
      (request.headers['x-user-id'] as string) || request.ip || 'unknown';
    return Promise.resolve(tracker);
  }
}
