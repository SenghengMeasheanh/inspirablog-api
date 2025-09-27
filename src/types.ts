import type { User } from "better-auth"

type Variables = {
	user?: User
}

export type AppContext = {
	Bindings: CloudflareBindings
	Variables: Variables
}