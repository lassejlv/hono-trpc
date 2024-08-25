import './utils/env';
import { Hono } from 'hono/quick';
import { logger as httpLogger } from 'hono/logger';
import { logger } from './utils/logger';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './router';
import { serveStatic } from 'hono/bun';
import { auth } from './routes/auth';

const app = new Hono();

// Middleware
app.use(httpLogger());

// Define TRPC route
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => ({
      var1: c,
    }),
  })
);

app.route('/auth', auth);

// Serve static files from the dist-frontend folder
app.use('*', serveStatic({ root: 'dist' }));
app.get('*', serveStatic({ path: './dist/index.html' }));

const PORT = parseInt(Bun.env.PORT as string) || 3000;

// Start server with Bun
const server = Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

logger.info(`starting server on port ${server.port}`);
