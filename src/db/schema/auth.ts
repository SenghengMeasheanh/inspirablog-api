import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core"
import { commentLikes, comments, postLikes, posts } from "./blog"
import { userProfile } from "./user-profile"

export const user = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: varchar("image", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    role: varchar("role", { length: 50 }).default("user"),
    banned: boolean("banned").notNull().default(false),
    banReason: varchar("ban_reason", { length: 500 }),
    banExpires: timestamp("ban_expires", { withTimezone: true })
  },
  (table) => [
    // Composite index for role-based queries with creation time ordering
    index("user_role_created_idx").on(table.role, table.createdAt),
    // Index for banned user queries
    index("user_banned_idx").on(table.banned),
    // Index for email verification status queries
    index("user_email_verified_idx").on(table.emailVerified),
    // Unique index on email (case-insensitive)
    uniqueIndex("user_email_unique_idx").on(table.email)
  ]
)

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(userProfile, {
    fields: [user.id],
    references: [userProfile.userId]
  }),
  posts: many(posts),
  comments: many(comments),
  postLikes: many(postLikes),
  commentLikes: many(commentLikes)
}))

export const session = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    ipAddress: varchar("ip_address", { length: 45 }), // IPv6 compatible
    userAgent: varchar("user_agent", { length: 1000 }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: uuid("impersonated_by").references(() => user.id, {
      onDelete: "set null"
    })
  },
  (table) => [
    // Composite index for active session queries (most common query pattern)
    index("session_user_expires_idx").on(table.userId, table.expiresAt),
    // Index for session cleanup queries
    index("session_expires_idx").on(table.expiresAt),
    // Index for security auditing
    index("session_ip_created_idx").on(table.ipAddress, table.createdAt),
    // Unique index on token for fast lookups
    uniqueIndex("session_token_unique_idx").on(table.token)
  ]
)

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 100 }).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true
    }),
    scope: varchar("scope", { length: 500 }),
    password: varchar("password", { length: 255 }), // For hashed passwords
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date())
  },
  (table) => [
    // Composite index for user account lookups by provider
    index("account_user_provider_idx").on(table.userId, table.providerId),
    // Index for provider-specific account lookups
    index("account_provider_account_idx").on(table.providerId, table.accountId),
    // Index for token refresh operations
    index("account_refresh_expires_idx").on(table.refreshTokenExpiresAt),
    // Unique constraint on provider + account combination
    uniqueIndex("account_provider_account_unique_idx").on(
      table.providerId,
      table.accountId
    )
  ]
)

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: varchar("identifier", { length: 320 }).notNull(), // Email length
    value: varchar("value", { length: 255 }).notNull(), // Verification code/token
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date())
  },
  (table) => [
    // Composite index for verification lookups (most common query)
    index("verification_identifier_value_idx").on(
      table.identifier,
      table.value
    ),
    // Index for cleanup of expired verifications
    index("verification_expires_idx").on(table.expiresAt),
    // Unique constraint to prevent duplicate active verifications
    uniqueIndex("verification_identifier_unique_idx").on(
      table.identifier,
      table.value
    )
  ]
)
