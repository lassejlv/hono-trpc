import { db } from '@/db';
import { userTable } from '@/db/schemas/user';
import { t } from '../utils/trpc';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const userRouter = t.router({
  getUser: t.procedure.input(z.string()).query(async ({ input }) => {
    const id = parseInt(input);
    if (isNaN(id)) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

    const user = await db
      .selectDistinct({
        id: userTable.id,
        name: userTable.name,
        avatar: userTable.avatar,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .where(eq(userTable.id, id));

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    return user[0];
  }),
});
