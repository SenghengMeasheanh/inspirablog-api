import { relations } from "drizzle-orm"
import {
	date,
	index,
	jsonb,
	pgEnum,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar
} from "drizzle-orm/pg-core"
import { user } from "./auth"

export const gender = pgEnum("gender", ["MALE", "FEMALE", "OTHER"])

export const userProfile = pgTable(
	"user_profile",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
				onUpdate: "cascade"
			}),
		bio: varchar("bio", { length: 500 }),
		dob: date("dob"),
		gender: gender("gender"),
		qr: varchar("qr", { length: 500 }), // Increased for longer URLs
		contact: jsonb("contact"),
		cover: varchar("cover", { length: 500 }), // Increased for longer URLs
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date())
	},
	(table) => [
		// Primary index for user profile lookups (most common query)
		index("user_profile_user_id_idx").on(table.userId),
		// Index for filtering profiles by gender (useful for analytics/demographics)
		index("user_profile_gender_idx").on(table.gender),
		// Index for age-based queries and demographics
		index("user_profile_dob_idx").on(table.dob),
		// Composite index for demographic analysis (gender + age)
		index("user_profile_gender_dob_idx").on(table.gender, table.dob),
		// Index for recently created profiles
		index("user_profile_created_idx").on(table.createdAt),
		// Unique constraint to ensure one profile per user
		uniqueIndex("user_profile_user_unique_idx").on(table.userId)
	]
)

export const userProfileRelations = relations(userProfile, ({ one }) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id]
	})
}))
