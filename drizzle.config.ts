import type { Config } from 'drizzle-kit';

export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: 'localhost',
    user: 'root',
    password: 'Yehtet446646804#',
    database: 'nestBlog',
  },
  driver: 'mysql2',
} satisfies Config;
