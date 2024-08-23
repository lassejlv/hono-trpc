import { generateTheme } from 'utils/ai';
import { t } from '../utils/trpc';
import { z } from 'zod';

const schema = z.object({
  prompt: z.string().min(10).max(250),
});

export const themeRouter = t.router({
  newTheme: t.procedure.input(schema).mutation(async ({ input }) => {
    const theme = await generateTheme(input.prompt);

    if (theme.error) throw new Error(theme.message);

    return theme.data as string;
  }),
});
