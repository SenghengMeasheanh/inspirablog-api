/*
 * To use Drizzle Kit CLI
 * The following configurations are required
 */
import dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: [".env", ".dev.vars"] })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL not found.")

export default defineConfig({
	schema: "./src/db/schema/**/*.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl
	}
})
