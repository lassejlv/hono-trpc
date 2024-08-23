import { t } from './utils/trpc';
import { userRouter } from './routes/users';
import { themeRouter } from './routes/theme';

const router = t.router;

export const appRouter = router({
  sayHi: t.procedure.query(() => {
    return 'hi';
  }),
  users: userRouter,
  theme: themeRouter,
});

export type AppRouter = typeof appRouter;
