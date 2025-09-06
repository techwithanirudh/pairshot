import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'
import { env } from '@/env'
import { db } from '@/server/db'
import * as schema from '@/server/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.CORS_ORIGIN ?? ''],
  baseURL: env.NEXT_PUBLIC_BASE_URL,
})

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
}
