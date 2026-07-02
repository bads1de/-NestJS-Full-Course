import type { PrismaClient } from '@prisma/client'

export async function createAuth(prisma: PrismaClient) {
  const { betterAuth } = await import('better-auth')
  const { prismaAdapter } = await import('better-auth/adapters/prisma')

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'sqlite',
    }),
    emailAndPassword: {
      enabled: true,
    },
  })
}

export type Auth = Awaited<ReturnType<typeof createAuth>>
