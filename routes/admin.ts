import { z } from 'zod';
import { t } from '../utils/trpc';
import { authChecker } from './auth';
import { TRPCError } from '@trpc/server';
import type { Context } from 'hono';
import { userTable, type SelectUser } from '@/db/schemas/user';
import { db } from '@/db';
import { sessionTable } from '@/db/schemas/session';
import { eq } from 'drizzle-orm';

const schema = z.object({
  limit: z.number().max(450).min(10),
});

const ensureAdmin = async (ctx: Context): Promise<SelectUser | undefined> => {
  const session = await authChecker(ctx);
  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' });
  if (!session.admin) throw new TRPCError({ code: 'FORBIDDEN', message: 'You must be an admin' });

  return session;
};

export const adminRouter = t.router({
  getUsers: t.procedure.input(schema).query(async ({ input, ctx }) => {
    const session = await ensureAdmin(ctx.c);
    if (!session) return;

    const users = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        avatar: userTable.avatar,
        admin: userTable.admin,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .limit(input.limit);

    return users;
  }),

  deleteUser: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    const session = await ensureAdmin(ctx.c);
    if (!session) return;

    await db.delete(sessionTable).where(eq(sessionTable.userId, input.id));
    await db.delete(userTable).where(eq(userTable.id, input.id));

    return true;
  }),
});
