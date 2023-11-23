import { relations } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  mysqlEnum,
  unique,
} from 'drizzle-orm/mysql-core';
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  role: int('role').default(0).notNull(),
  profile: text('profile'),
  suspended: boolean('suspended').default(false).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', {
    length: 256,
  }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const blogs = mysqlTable('blogs', {
  id: int('id').primaryKey().autoincrement(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow(),
  author_id: int('author_id')
    .notNull()
    .references(() => users.id),
  likes: int('likes').default(0),
  dislikes: int('dislikes').default(0),
  comment_count: int('comment_count').default(0),
});

export const blog_reactions = mysqlTable(
  'reactions',
  {
    id: int('id').primaryKey().autoincrement(),
    reaction: mysqlEnum('reaction', ['like', 'dislike']),
    author_id: int('author_id').references(() => users.id),
    blog_id: int('blog_id').references(() => blogs.id),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (t) => ({
    uq1: unique().on(t.author_id, t.blog_id),
  }),
);

export const comments = mysqlTable('comments', {
  id: int('id').primaryKey().autoincrement(),
  context: text('context'),
  createdAt: timestamp('createdAt').defaultNow(),
  author_id: int('author_id').references(() => users.id),
  blog_id: int('blog_id').references(() => blogs.id),
});

export const userRelation = relations(users, ({ many }) => ({
  blogs: many(blogs),
  reactions: many(blog_reactions),
  comments: many(comments),
}));
export const blogRelation = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.author_id],
    references: [users.id],
  }),
  reactions: many(blog_reactions),
  comments: many(comments),
}));

export const blog_reactionRelation = relations(blog_reactions, ({ one }) => ({
  author: one(users, {
    fields: [blog_reactions.author_id],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [blog_reactions.blog_id],
    references: [blogs.id],
  }),
}));

export const commentRelation = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.author_id],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [comments.blog_id],
    references: [blogs.id],
  }),
}));
