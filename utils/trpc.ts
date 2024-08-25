import { initTRPC } from '@trpc/server';
import type { Context } from 'hono';

type HonoContext = {
  c: Context;
};

export const t = initTRPC.context<HonoContext>().create();
