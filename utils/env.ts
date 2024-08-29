import { z } from 'zod';

const env = z.object({
  PORT: z.string(),
  OPENAI_KEY: z.string(),
  TURSO_CONNECTION_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
});

const parsedData = env.safeParse(Bun.env);

if (!parsedData.success) {
  // prettify erros
  console.error('Error parsing environment variables:');
  console.table(parsedData.error.errors);
  process.exit(1);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> {}
  }
}
