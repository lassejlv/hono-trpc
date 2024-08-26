import { TRPCError } from '@trpc/server';
import { db } from 'db';
import { userTable, type SelectUser } from '@/db/schemas/user';
import { eq } from 'drizzle-orm';
import { t } from '../utils/trpc';
import { z } from 'zod';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { sessionTable } from 'db/schemas/session';
import type { Context } from 'hono';

const schema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(64),
});

const updateSchema = z.object({
  name: z.string().min(2).max(255),
});

export const authRouter = t.router({
  register: t.procedure.input(schema).mutation(async ({ input, ctx }) => {
    const hasCookie = getCookie(ctx.c, 'session');
    if (hasCookie) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User already logged in' });

    // check if user exists
    const userExists = await db.query.userTable.findFirst({
      where: eq(userTable.email, input.email),
    });

    if (userExists) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User already exists', cause: 'email' });

    // create user
    const result = await db
      .insert(userTable)
      .values({
        name: input.name,
        email: input.email,
        password: await Bun.password.hash(input.password),
      })
      .returning();

    return result;
  }),
  login: t.procedure.input(schema.pick({ email: true, password: true })).mutation(async ({ input, ctx }) => {
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, input.email),
    });

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const passwordMatch = await Bun.password.verify(input.password, user.password);
    if (!passwordMatch) throw new Error('Invalid password');

    const result = await db.insert(sessionTable).values({ userId: user.id }).returning();

    console.log(result);

    // set cookie
    setCookie(ctx.c, 'session', result[0].token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });

    return 'User logged in';
  }),
  logout: t.procedure.query(async ({ ctx }) => {
    const cookie = getCookie(ctx.c, 'session');
    if (!cookie) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No session cookie' });

    const session = await db.query.sessionTable.findFirst({
      where: eq(sessionTable.token, cookie),
    });

    if (!session) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' });

    await db.delete(sessionTable).where(eq(sessionTable.token, cookie));
    await deleteCookie(ctx.c, 'session');

    return 'User logged out';
  }),
  me: t.procedure.query(async ({ ctx }): Promise<SelectUser> => {
    const cookie = getCookie(ctx.c, 'session');
    if (!cookie) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No session cookie' });

    const session = await db.query.sessionTable.findFirst({
      where: eq(sessionTable.token, cookie),
      with: { user: true },
    });

    if (!session) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' });

    return session.user;
  }),
  updateUser: t.procedure.input(updateSchema).mutation(async ({ input, ctx }) => {
    const session = await authChecker(ctx.c);
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not logged in' });

    await db.update(userTable).set({ name: input.name }).where(eq(userTable.id, session.id));

    return 'User updated';
  }),
});

const authChecker = async (ctx: Context): Promise<SelectUser | null> => {
  const hasCookie = getCookie(ctx, 'session');
  if (!hasCookie) return null;

  const session = await db.query.sessionTable.findFirst({
    where: eq(sessionTable.token, hasCookie),
    with: { user: true },
  });

  if (!session) return null;

  return session.user;
};
