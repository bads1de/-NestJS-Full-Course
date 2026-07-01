import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const role = req.headers['role'];

    if (role !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to access this API',
      );
    }

    return true;
  }
}
