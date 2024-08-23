import { db } from 'db';
import { t } from '../utils/trpc';

export const userRouter = t.router({
  getUsers: t.procedure.query(async () => {
    const users = await db.query.userTable.findMany();
    return users;
  }),
});
