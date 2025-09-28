import { HTTPException } from "hono/http-exception"

export function error500(message?: string) {
	return new HTTPException(500, { message: message ?? "Something went wrong" })
}

export function error404(message?: string) {
	return new HTTPException(404, { message: message ?? "Not Found" })
}

export function error401(message?: string) {
	return new HTTPException(401, { message: message ?? "Unauthorized" })
}

export function error403(message?: string) {
	return new HTTPException(403, { message: message ?? "Forbidden" })
}
