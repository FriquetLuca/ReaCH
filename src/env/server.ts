import dotenv from "dotenv";
import { z } from "zod";
import FormatErrors from "../utils/formatErrors";

type DotEnv = {
  NODE_ENV: "development" | "production";
  HOST?: string;
  PORT?: number;
};

const serverSchema = z.object({
  NODE_ENV: z.string()
    .refine(item => item === "development" || item === "production", {
      message: "The environment variable NODE_ENV can only be 'development' or 'production'"
    }),
  HOST: z.preprocess((str) => process.env.VERCEL_URL ?? str, // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    z.string(),
  ).optional(),
  PORT: z.string().transform(item => Number(item)).optional()
});

dotenv.config();
const serverEnv = serverSchema.safeParse(process.env);

if(!serverEnv.success) {
  console.error("❌ Invalid environment variables:\n", ...FormatErrors(serverEnv.error.format()));
  throw new Error("Invalid environment variables");
}

export const env = serverEnv.data as DotEnv;