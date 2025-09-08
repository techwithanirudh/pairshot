import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    GOOGLE_GENERATIVE_AI_API_KEY: z
      .string()
      .min(
        1,
        'GOOGLE_GENERATIVE_AI_API_KEY is required. Please set it in your .env file.'
      ),
    // Database
    DATABASE_URL: z.url(),
    // Auth
    BETTER_AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().min(1).optional(),
    CORS_ORIGIN: z.preprocess((val) => {
      if (typeof val === 'string') {
        const s = val.trim()
        if (s === '') return undefined
        try {
          const parsed = JSON.parse(s)
          if (Array.isArray(parsed)) return parsed
        } catch {
          // ignore JSON parse errors
        }
        return s
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
      }
      return val
    }, z.array(z.url()).optional()),
    // BETTER_AUTH_URL: z.string().min(1).optional(),
    // Blob
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
})
