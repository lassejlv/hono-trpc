import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as user from './schemas/user';
import * as session from './schemas/session';

const client = createClient({
  url: Bun.env.TURSO_CONNECTION_URL,
  authToken: Bun.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema: { ...user, ...session } });
