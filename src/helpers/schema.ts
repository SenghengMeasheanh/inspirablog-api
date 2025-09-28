import { z } from "@hono/zod-openapi"

export const QuerySchema = z.object({
	page: z.coerce.number().min(1).default(1).optional().openapi({
		example: 1,
		description: "Page number for pagination"
	}),
	limit: z.coerce.number().min(1).max(100).default(10).optional().openapi({
		example: 10,
		description: "Number of items per page"
	}),
	search: z.string().optional().openapi({
		example: "music",
		description: "Search term for name or description"
	})
})

export const PagingSchema = z.object({
	page: z.number(),
	limit: z.number(),
	total: z.number(),
	totalPages: z.number()
})

// Parameter schema for ID validation
export const IDParamsSchema = z.object({
	id: z.uuid().openapi({
		example: "123e4567-e89b-12d3-a456-426614174000",
		description: "UUID"
	})
})
