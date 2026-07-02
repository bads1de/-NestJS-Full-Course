import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthFactoryService } from '../lib/auth/auth-factory.service';
import { PrismaService } from '../lib/database/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authFactory: AuthFactoryService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = await this.authFactory.getAuth();
    const headers = new Headers(request.headers as Record<string, string>);
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role === 'admin') {
      request['user'] = { ...session.user, role: user.role };
      return true;
    }

    if (process.env.AUTO_ADMIN_FIRST_USER !== 'false') {
      const adminExists = await this.prisma.user.findFirst({
        where: { role: 'admin' },
        select: { id: true },
      });

      if (!adminExists) {
        await this.prisma.user.update({
          where: { id: session.user.id },
          data: { role: 'admin' },
        });
        request['user'] = { ...session.user, role: 'admin' };
        return true;
      }
    }

    throw new ForbiddenException('Admin access required');
  }
}
