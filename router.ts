import { t } from './utils/trpc';
import { userRouter } from './routes/users';

const router = t.router;

export const appRouter = router({
  sayHi: t.procedure.query(() => {
    return 'hi';
  }),
  users: userRouter,
});

export type AppRouter = typeof appRouter;
