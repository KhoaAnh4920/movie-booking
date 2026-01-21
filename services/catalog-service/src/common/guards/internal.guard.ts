import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class InternalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const caller = req.headers['x-internal-call'];

    if (!caller) {
      throw new ForbiddenException('Internal access only');
    }

    return true;
  }
}
