import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle',
  // dbCredentials: {
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  // },
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
  driver: 'mysql2',
} satisfies Config;
