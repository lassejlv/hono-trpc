import { z } from 'zod';

const env = z.object({
  PORT: z.string(),
  OPENAI_KEY: z.string(),
  TURSO_CONNECTION_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
});

env.parse(Bun.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> {}
  }
}
