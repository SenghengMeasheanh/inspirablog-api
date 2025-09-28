import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core"
import { user } from "./auth"

// Enums
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived"
])

export const commentStatusEnum = pgEnum("comment_status", [
  "pending",
  "approved",
  "rejected",
  "spam"
])

// Categories table
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    color: varchar("color", { length: 7 }), // For hex colors like #FF5733
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => ({
    slugIdx: index("categories_slug_idx").on(table.slug),
    nameIdx: index("categories_name_idx").on(table.name)
  })
)

// Tags table
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 7 }), // For hex colors
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => ({
    slugIdx: index("tags_slug_idx").on(table.slug),
    nameIdx: index("tags_name_idx").on(table.name)
  })
)

// Posts table
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    featuredImage: text("featured_image"), // URL to featured image
    status: postStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at"),
    viewCount: integer("view_count").default(0).notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    commentsCount: integer("comments_count").default(0).notNull(),
    readTimeMinutes: integer("read_time_minutes").default(0).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    allowComments: boolean("allow_comments").default(true).notNull(),
    seoTitle: varchar("seo_title", { length: 60 }),
    seoDescription: varchar("seo_description", { length: 160 }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => ({
    slugIdx: index("posts_slug_idx").on(table.slug),
    authorIdx: index("posts_author_idx").on(table.authorId),
    categoryIdx: index("posts_category_idx").on(table.categoryId),
    statusIdx: index("posts_status_idx").on(table.status),
    publishedAtIdx: index("posts_published_at_idx").on(table.publishedAt),
    featuredIdx: index("posts_featured_idx").on(table.isFeatured),
    createdAtIdx: index("posts_created_at_idx").on(table.createdAt)
  })
)

// Post-Tags junction table (many-to-many)
export const postTags = pgTable(
  "post_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    postTagIdx: index("post_tags_post_tag_idx").on(table.postId, table.tagId),
    postIdx: index("post_tags_post_idx").on(table.postId),
    tagIdx: index("post_tags_tag_idx").on(table.tagId)
  })
)

// Comments table
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    status: commentStatusEnum("status").default("pending").notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    isEdited: boolean("is_edited").default(false).notNull(),
    editedAt: timestamp("edited_at"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"), // Self-reference for nested comments
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => ({
    postIdx: index("comments_post_idx").on(table.postId),
    authorIdx: index("comments_author_idx").on(table.authorId),
    statusIdx: index("comments_status_idx").on(table.status),
    parentIdx: index("comments_parent_idx").on(table.parentId),
    createdAtIdx: index("comments_created_at_idx").on(table.createdAt)
  })
)

// Post likes table (for tracking user likes on posts)
export const postLikes = pgTable(
  "post_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    userPostIdx: index("post_likes_user_post_idx").on(
      table.userId,
      table.postId
    ),
    postIdx: index("post_likes_post_idx").on(table.postId),
    userIdx: index("post_likes_user_idx").on(table.userId)
  })
)

// Comment likes table (for tracking user likes on comments)
export const commentLikes = pgTable(
  "comment_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    userCommentIdx: index("comment_likes_user_comment_idx").on(
      table.userId,
      table.commentId
    ),
    commentIdx: index("comment_likes_comment_idx").on(table.commentId),
    userIdx: index("comment_likes_user_idx").on(table.userId)
  })
)

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts)
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags)
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(user, {
    fields: [posts.authorId],
    references: [user.id]
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id]
  }),
  comments: many(comments),
  postTags: many(postTags),
  postLikes: many(postLikes)
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id]
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id]
  })
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(user, {
    fields: [comments.authorId],
    references: [user.id]
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "parentComment"
  }),
  replies: many(comments, {
    relationName: "parentComment"
  }),
  commentLikes: many(commentLikes)
}))

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(user, {
    fields: [postLikes.userId],
    references: [user.id]
  }),
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id]
  })
}))

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  user: one(user, {
    fields: [commentLikes.userId],
    references: [user.id]
  }),
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id]
  })
}))

