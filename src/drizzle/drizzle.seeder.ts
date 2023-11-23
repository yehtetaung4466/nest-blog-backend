import { drizzle } from 'drizzle-orm/mysql2';
import { blogs, users } from './schema';
import { createConnection } from 'mysql2';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import { faker } from '@faker-js/faker';
import { exit } from 'process';
import { hash } from 'argon2';
dotenv.config({ path: './.env' });

const main = async () => {
  const password = await hash('password');
  console.log('start');
  const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
  });
  console.log('connect database');
  const db = drizzle(connection, {
    schema,
    mode: 'default',
  });
  console.log('assigned to drizzle');
  const userData: {
    name: string;
    email: string;
    password: string;
  }[] = [];
  const blogData: {
    title: string;
    content: string;
    author_id: number;
  }[] = [];
  console.log('generate userdata');
  for (let i = 0; i < 20; i++) {
    userData.push({
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password,
    });
    blogData.push({
      title: faker.internet.color(),
      content: faker.internet.displayName(),
      author_id: 1,
    });
  }
  console.log('start seeding');
  await db.insert(users).values(userData);
  await db.insert(blogs).values(blogData);
  console.log('seeding complete');
  exit();
};
main();
