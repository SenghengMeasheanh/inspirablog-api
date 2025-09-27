import type { User } from "better-auth"
import { type DB, drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, bearer, openAPI } from "better-auth/plugins"
import * as schema from "~/db/schema"

type EmailData = {
	user: User
	url: string
	token: string
}

interface Args {
	db: DB
	appName?: string
	baseURL?: string
	secret?: string
	googleClientId?: string
	googleClientSecret?: string
	sendResetPassword?: ({ user, url }: EmailData) => Promise<void>
	sendVerificationEmail?: (data: EmailData, request?: Request) => Promise<void>
}

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions = (args: Args) => {
	const {
		googleClientId,
		googleClientSecret,
		sendResetPassword,
		sendVerificationEmail
	} = args
	return {
		telemetry: { enabled: false },
		baseURL: args.baseURL,
		trustedOrigins: ["http://localhost:5173"],
		secret: args.secret,
		appName: args.appName ?? "Plumpi",
		basePath: "/auth",
		database: drizzleAdapter(args.db, { provider: "pg", schema }),
		account: {
			accountLinking: {
				enabled: true
			}
		},
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 6,
			maxPasswordLength: 128,
			requireEmailVerification: true,
			sendResetPassword
		},
		emailVerification: {
			sendOnSignUp: true,
			expiresIn: 3600, // 1 hour
			sendVerificationEmail
		},
		socialProviders: {
			google:
				googleClientId && googleClientSecret
					? {
							enabled: true,
							clientId: googleClientId,
							clientSecret: googleClientSecret,
							mapProfileToUser: (profile: {
								given_name: string
								family_name: string
							}) => {
								return {
									firstName: profile.given_name,
									lastName: profile.family_name
								}
							}
						}
					: undefined
		},
		plugins: [openAPI(), admin(), bearer()]
	}
}
