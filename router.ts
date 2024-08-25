import { t } from './utils/trpc';
import { authRouter } from './routes/auth';

const router = t.router;

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
