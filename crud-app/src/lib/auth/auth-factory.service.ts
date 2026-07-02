import { Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { createAuth, Auth } from './auth.config'

@Injectable()
export class AuthFactoryService {
  private authPromise: Promise<Auth> | null = null

  constructor(private readonly prisma: PrismaService) {}

  async getAuth(): Promise<Auth> {
    if (!this.authPromise) {
      this.authPromise = createAuth(this.prisma)
    }
    return this.authPromise
  }
}
