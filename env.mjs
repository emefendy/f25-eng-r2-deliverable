import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // Skip validation if this env var is set
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  server: {
    OPENAI_API_KEY: z.string().min(1).optional(),
    SECRET_SUPABASE_CONNECTION_STRING: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SECRET_SUPABASE_CONNECTION_STRING: process.env.SECRET_SUPABASE_CONNECTION_STRING,
  },
});
