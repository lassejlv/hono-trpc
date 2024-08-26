import { t } from './utils/trpc';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';

const router = t.router;

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
