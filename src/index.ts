import { swaggerUI } from "@hono/swagger-ui"
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { apiInfo } from "./helpers/openapi"
import auth from "./modules/auth"
import type { AppContext } from "./types"

const app = new OpenAPIHono<AppContext>()
const v1 = new OpenAPIHono<AppContext>()

// Define health check route schema
const healthRoute = createRoute({
  method: "get",
  path: "/health",
  summary: "Health check endpoint",
  description: "Returns API health status",
  tags: ["Health"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string(),
            timestamp: z.string()
          })
        }
      },
      description: "API is healthy"
    }
  }
})

// Add the health check route
v1.openapi(healthRoute, (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
})

// Configure OpenAPI documentation
v1.doc("/openapi.json", apiInfo)

v1.get(
  "/docs",
  swaggerUI({
    url: "/auth/openapi.json" // Pointing to the auth module's OpenAPI spec
  })
)

// Mount routes
app.route("/v1", v1)
app.route("/auth", auth)

app.get("/", (c) => c.redirect("/v1/docs"))

export default app
