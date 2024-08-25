import { TRPCError } from '@trpc/server';
import { db } from 'db';
import { userTable } from '@/db/schemas/user';
import { eq } from 'drizzle-orm';
import { t } from '../utils/trpc';
import { z } from 'zod';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getCookie, setCookie } from 'hono/cookie';
import { sessionTable } from 'db/schemas/session';

const schema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(64),
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

    return 'User logged in';
  }),
});

// Login Route (i can't set cookies with trpc)
export const auth = new Hono();

auth.get('/me', async (c) => {
  try {
    const cookie = getCookie(c, 'session');
    if (!cookie) throw new Error('No session cookie');

    const session = await db.query.sessionTable.findFirst({
      where: eq(sessionTable.token, cookie),
      with: { user: true },
    });

    if (!session) throw new Error('Session not found');

    return c.json(session.user);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});
