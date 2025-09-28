import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Environment variable for database URL
const sql = neon(process.env.DATABASE_URL!)

// Create drizzle database instance with schema
export const db = drizzle(sql, { schema })

// Export schema for use in other parts of the application
export { schema }

// Export types
export * from "./types"
