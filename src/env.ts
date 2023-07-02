import { z } from 'zod'

export const envSchema = z
  .object({
    VT_API_KEY: z.string(),
  })
  .parse(process.env)
