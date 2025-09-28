import { Hono } from "hono"
import { getBetterAuth } from "~/better-auth"
import type { AppContext } from "~/types"

const auth = new Hono<AppContext>()

auth.get("/openapi.json", async (c) => {
	const betterAuth = await getBetterAuth(c.env)
	const openAPISchema = await betterAuth.api.generateOpenAPISchema()
	return c.json(openAPISchema)
})

auth.on(["POST", "GET"], "/*", async (c) => {
	const betterAuth = await getBetterAuth(c.env)
	return await betterAuth.handler(c.req.raw)
})

export default auth
