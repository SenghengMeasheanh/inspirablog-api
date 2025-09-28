import { swaggerUI } from "@hono/swagger-ui"
import { OpenAPIHono } from "@hono/zod-openapi"
import { apiInfo } from "./helpers/openapi"
import type { AppContext } from "./types"

const app = new OpenAPIHono<AppContext>()
const v1 = new OpenAPIHono<AppContext>()

// Use app.route() instead of app.all()

v1.doc("/openapi.json", apiInfo)
app.route("/v1", v1)
v1.get(
  "/docs",
  swaggerUI({
    urls: [
      {
        title: "Default",
        url: "/v1/openapi.json"
      },
      {
        title: "Auth",
        url: "/auth/openapi.json"
      }
    ]
  })
)
app.get("/", (c) => c.text("Plumpi API develop"))

export default app
