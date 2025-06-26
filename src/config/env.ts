// import { z } from 'zod';

// const envSchema = z.object({
//   APP_BASE_PATH: z.string(),
//   MOCK_API: z.string().optional()
// });

// export const env = envSchema.parse(process.env);

import { z } from 'zod';

const envSchema = z.object({
  APP_BASE_PATH: z.string().default('/'),
  MOCK_API: z.string().optional()
});

export const env = envSchema.parse({
  APP_BASE_PATH: process.env.APP_BASE_PATH || process.env.VITE_APP_BASE_PATH,
  MOCK_API: process.env.MOCK_API || process.env.VITE_MOCK_API
});
