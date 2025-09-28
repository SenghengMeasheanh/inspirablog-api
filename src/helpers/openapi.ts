import { type Hook, z } from "@hono/zod-openapi"
import type { AppContext } from "~/types"

export const apiInfo = {
  openapi: "3.1.1",
  info: { version: "1.1.0", title: "Plumpi API" },
  tags: [
  ],
  servers: [{ url: "http://localhost:8787/v1", description: "Local Server" }],
  security: [{ bearerAuth: [] }]
}

export const getOpenApiSources = [
  {
    title: "V1",
    url: "/v1/openapi.json"
  },
  {
    title: "Auth",
    url: "/auth/openapi.json"
  }
]

export const Error500Schema = z.object({
  message: z.string().meta({
    example: "Internal Server Error"
  })
})

export function createErrorSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) {
  const fieldErrorsShape = Object.keys(schema.shape).reduce(
    (acc, key) => {
      acc[key] = z.array(z.string())
      return acc
    },
    {} as Record<string, z.ZodArray<z.ZodString>>
  )

  // Zod's flattenError shape
  return z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.object(fieldErrorsShape)
  })
}

export function getContent<T extends z.core.$ZodShape>(
  schema: z.ZodObject<T>,
  description: string
) {
  return {
    content: {
      "application/json": { schema }
    },
    description
  }
}

export function getBodyContent<T extends z.core.$ZodShape>(
  schema: z.ZodObject<T>
) {
  return getContent(schema, "Request parameters")
}

export function getSuccessContent<T extends z.core.$ZodShape>(
  schema: z.ZodObject<T>
) {
  return getContent(schema, "Successful response")
}

// biome-ignore lint/suspicious/noExplicitAny: false
export const defaultHook: Hook<any, AppContext, any, any> = (result, c) => {
  if (!result.success) return c.json(z.flattenError(result.error), 400)
}
