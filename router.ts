import { t } from './utils/trpc';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { adminRouter } from './routes/admin';

const router = t.router;

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
