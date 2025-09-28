CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'rejected', 'spam');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"provider_id" varchar(100) NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" varchar(500),
	"password" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(1000),
	"user_id" uuid NOT NULL,
	"impersonated_by" uuid,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"role" varchar(50) DEFAULT 'user',
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" varchar(500),
	"ban_expires" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" varchar(320) NOT NULL,
	"value" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"color" varchar(7),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comment_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"comment_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"status" "comment_status" DEFAULT 'pending' NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp,
	"author_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"featured_image" text,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"view_count" integer DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"read_time_minutes" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"allow_comments" boolean DEFAULT true NOT NULL,
	"seo_title" varchar(60),
	"seo_description" varchar(160),
	"author_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"color" varchar(7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bio" varchar(500),
	"dob" date,
	"gender" "gender",
	"qr" varchar(500),
	"contact" jsonb,
	"cover" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_impersonated_by_user_id_fk" FOREIGN KEY ("impersonated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "account_user_provider_idx" ON "account" USING btree ("user_id","provider_id");--> statement-breakpoint
CREATE INDEX "account_provider_account_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "account_refresh_expires_idx" ON "account" USING btree ("refresh_token_expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "session_user_expires_idx" ON "session" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "session_expires_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "session_ip_created_idx" ON "session" USING btree ("ip_address","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_unique_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_role_created_idx" ON "user" USING btree ("role","created_at");--> statement-breakpoint
CREATE INDEX "user_banned_idx" ON "user" USING btree ("banned");--> statement-breakpoint
CREATE INDEX "user_email_verified_idx" ON "user" USING btree ("email_verified");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_unique_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_value_idx" ON "verification" USING btree ("identifier","value");--> statement-breakpoint
CREATE INDEX "verification_expires_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_identifier_unique_idx" ON "verification" USING btree ("identifier","value");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "comment_likes_user_comment_idx" ON "comment_likes" USING btree ("user_id","comment_id");--> statement-breakpoint
CREATE INDEX "comment_likes_comment_idx" ON "comment_likes" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "comment_likes_user_idx" ON "comment_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comments_post_idx" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "comments_author_idx" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "comments_status_idx" ON "comments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "post_likes_user_post_idx" ON "post_likes" USING btree ("user_id","post_id");--> statement-breakpoint
CREATE INDEX "post_likes_post_idx" ON "post_likes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_likes_user_idx" ON "post_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "post_tags_post_tag_idx" ON "post_tags" USING btree ("post_id","tag_id");--> statement-breakpoint
CREATE INDEX "post_tags_post_idx" ON "post_tags" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_tags_tag_idx" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "posts_featured_idx" ON "posts" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_profile_user_id_idx" ON "user_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profile_gender_idx" ON "user_profile" USING btree ("gender");--> statement-breakpoint
CREATE INDEX "user_profile_dob_idx" ON "user_profile" USING btree ("dob");--> statement-breakpoint
CREATE INDEX "user_profile_gender_dob_idx" ON "user_profile" USING btree ("gender","dob");--> statement-breakpoint
CREATE INDEX "user_profile_created_idx" ON "user_profile" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_profile_user_unique_idx" ON "user_profile" USING btree ("user_id");