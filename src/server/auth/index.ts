import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { anonymous } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { env } from '@/env'
import { db } from '@/server/db'
import * as schema from '@/server/db/schema'
import type { NextRequest } from 'next/server'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [anonymous()],
  trustedOrigins: env.CORS_ORIGIN,
  baseURL: env.NEXT_PUBLIC_BASE_URL,
})

export const getSession = async (request?: NextRequest) => {
  return auth.api.getSession({
    headers: request ? request.headers : await headers(),
  })
}
