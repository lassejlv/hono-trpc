import { TRPCError } from '@trpc/server';
import { db } from 'db';
import { userTable, type SelectUser } from '@/db/schemas/user';
import { and, eq } from 'drizzle-orm';
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
  avatar: z.string().max(255).optional(),
});

const deleteSchema = z.object({
  confirm: z.boolean().refine((v) => v === true, {
    message: 'You must be absolutely sure to delete this account',
  }),
  abosolutelySureToDeleteThisAccount: z.boolean().refine((v) => v === true, {
    message: 'You must be absolutely sure to delete this account',
  }),
  password: z.string().min(8).max(64),
});

export const authRouter = t.router({
  register: t.procedure.input(schema).mutation(async ({ input, ctx }) => {
    const session = await authChecker(ctx.c);
    if (session) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User already logged in' });

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
  me: t.procedure.query(async ({ ctx }) => {
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

    await db
      .update(userTable)
      .set({ name: input.name, avatar: input.avatar || session.avatar })
      .where(eq(userTable.id, session.id));

    return 'User updated';
  }),
  getSessions: t.procedure.query(async ({ ctx }) => {
    const session = await authChecker(ctx.c);
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not logged in' });

    const sessions = await db
      .select({
        id: sessionTable.id,
        expiresAt: sessionTable.expiresAt,
        createdAt: sessionTable.createdAt,
      })
      .from(sessionTable)
      .where(eq(sessionTable.userId, session.id));

    return sessions;
  }),
  revokeSession: t.procedure.input(z.string()).query(async ({ input, ctx }) => {
    const session = await authChecker(ctx.c);
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not logged in' });

    const id = parseInt(input);
    if (isNaN(id)) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid session ID' });

    const sessionExists = await db.query.sessionTable.findFirst({
      where: and(eq(sessionTable.userId, session.id), eq(sessionTable.id, id)),
    });

    if (!sessionExists) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' });

    await db.delete(sessionTable).where(eq(sessionTable.id, id));

    return 'Session revoked';
  }),
  deleteUser: t.procedure.input(deleteSchema).mutation(async ({ input, ctx }) => {
    const session = await authChecker(ctx.c);
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not logged in' });

    const passwordMatch = await Bun.password.verify(input.password, session.password);
    if (!passwordMatch) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid password' });

    await db.delete(sessionTable).where(eq(sessionTable.userId, session.id));
    await db.delete(userTable).where(eq(userTable.id, session.id));

    return 'User deleted';
  }),
});

export const authChecker = async (ctx: Context): Promise<SelectUser | null> => {
  const hasCookie = getCookie(ctx, 'session');
  if (!hasCookie) return null;

  const session = await db.query.sessionTable.findFirst({
    where: eq(sessionTable.token, hasCookie),
    with: { user: true },
  });

  if (!session) return null;

  return session.user;
};
