import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';
import crypto from 'crypto';

export const sessionTable = sqliteTable('session', {
  id: integer('id').primaryKey(),
  userId: integer('userId').notNull(),
  token: text('token')
    .notNull()
    .$defaultFn(() => crypto.randomBytes(32).toString('hex')),
  expiresAt: integer('expiresAt')
    .notNull()
    .$defaultFn(() => Date.now() + 1000 * 60 * 60 * 24 * 7),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text('updatedAt')
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export type InsertSession = typeof sessionTable.$inferInsert;
export type SelectSession = typeof sessionTable.$inferSelect;
