import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthFactoryService } from './lib/auth/auth-factory.service';
import { PrismaService } from './lib/database/prisma.service';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authFactory: AuthFactoryService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/me')
  async getMe(@Req() req: Request) {
    const auth = await this.authFactory.getAuth();
    const headers = new Headers(req.headers as Record<string, string>);
    const session = await auth.api.getSession({ headers });
    if (!session?.user) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, emailVerified: true },
    });
    return user;
  }
}
