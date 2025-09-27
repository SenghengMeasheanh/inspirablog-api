/**
 * Better Auth CLI configuration file
 *
 * Docs: https://www.better-auth.com/docs/concepts/cli
 */

import { betterAuth } from "better-auth"
import dotenv from "dotenv"
import { getDatabase } from "~/helpers/db"
import { betterAuthOptions } from "./options"

dotenv.config({ path: [".env", ".dev.vars"] })

const env = process.env

if (!env.DATABASE_URL) throw new Error("DATABASE_URL not found.")
if (!env.BETTER_AUTH_SECRET) throw new Error("BETTER_AUTH_SECRET not found.")
const db = await getDatabase(env.DATABASE_URL)
const secret = env.BETTER_AUTH_SECRET

export const auth: ReturnType<typeof betterAuth> = betterAuth(
	betterAuthOptions({ db, secret })
)
