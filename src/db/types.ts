// TypeScript types for blog database schema
import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import type { user } from "./schema/auth"
import type {
  categories,
  commentLikes,
  comments,
  postLikes,
  posts,
  postTags,
  tags
} from "./schema/blog"

// User types (from auth schema)
export type User = InferSelectModel<typeof user>
export type InsertUser = InferInsertModel<typeof user>

// Category types
export type Category = InferSelectModel<typeof categories>
export type InsertCategory = InferInsertModel<typeof categories>

// Tag types
export type Tag = InferSelectModel<typeof tags>
export type InsertTag = InferInsertModel<typeof tags>

// Post types
export type Post = InferSelectModel<typeof posts>
export type InsertPost = InferInsertModel<typeof posts>

// Post with relations
export type PostWithAuthor = Post & {
  author: User
}

export type PostWithCategory = Post & {
  category: Category
}

export type PostWithTags = Post & {
  postTags: (PostTag & { tag: Tag })[]
}

export type PostFull = Post & {
  author: User
  category: Category
  postTags: (PostTag & { tag: Tag })[]
  comments: Comment[]
}

// PostTag types
export type PostTag = InferSelectModel<typeof postTags>
export type InsertPostTag = InferInsertModel<typeof postTags>

// Comment types
export type Comment = InferSelectModel<typeof comments>
export type InsertComment = InferInsertModel<typeof comments>

// Comment with relations
export type CommentWithAuthor = Comment & {
  author: User
}

export type CommentWithReplies = Comment & {
  author: User
  replies: CommentWithAuthor[]
}

// Like types
export type PostLike = InferSelectModel<typeof postLikes>
export type InsertPostLike = InferInsertModel<typeof postLikes>

export type CommentLike = InferSelectModel<typeof commentLikes>
export type InsertCommentLike = InferInsertModel<typeof commentLikes>

// Utility types for API responses
export type PostSummary = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "featuredImage"
  | "publishedAt"
  | "readTimeMinutes"
  | "viewCount"
  | "likesCount"
  | "commentsCount"
  | "isFeatured"
> & {
  author: Pick<User, "id" | "name" | "image">
  category: Pick<Category, "id" | "name" | "slug" | "color">
}

export type PostCard = PostSummary & {
  tags: Pick<Tag, "id" | "name" | "slug" | "color">[]
}

// Enum types for better type safety
export type PostStatus = "draft" | "published" | "archived"
export type CommentStatus = "pending" | "approved" | "rejected" | "spam"
