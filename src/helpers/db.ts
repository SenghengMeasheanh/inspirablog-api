import type { NeonHttpDatabase } from "drizzle-orm/neon-http"

const db: NeonHttpDatabase | null = null

export async function getDatabase(connectionString: string) {
	if (db) return db
	const [{ neon, neonConfig }, { drizzle }] = await Promise.all([
		import("@neondatabase/serverless"),
		import("drizzle-orm/neon-http")
	])
	neonConfig.poolQueryViaFetch = true

	const client = neon(connectionString)

	return drizzle({ client })
}
