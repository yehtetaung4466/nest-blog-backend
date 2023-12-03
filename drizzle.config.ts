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
    connectionString: 'mysql://avnadmin:AVNS_By4qLC7RH-oqsQaycYW@nestblog-yehtet804p-17df.a.aivencloud.com:25366/defaultdb?ssl-mode=REQUIRED',
  },
  driver: 'mysql2',
} satisfies Config;
