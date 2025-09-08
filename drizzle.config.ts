import type { Config } from 'drizzle-kit'

import { env } from '@/env'

export default {
  schema: './src/server/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ['add-me_*'],
} satisfies Config
