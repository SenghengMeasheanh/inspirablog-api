import { betterAuth } from "better-auth"
import { betterAuthOptions } from "~/better-auth/options"
import { getDatabase } from "~/helpers/db"
import { sendOTPVerification, sendResetPasswordEmail, sendVerificationEmail } from "~/mailer"

/**
 * Better Auth Instance
 */
export const getBetterAuth = async (env: CloudflareBindings) => {
	const { DATABASE_URL } = env
	const db = await getDatabase(DATABASE_URL)
	const options = betterAuthOptions({
		db,
		appName: env.APP_NAME,
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		googleClientId: env.GOOGLE_CLIENT_ID,
		googleClientSecret: env.GOOGLE_CLIENT_SECRET,
		sendResetPassword: async ({ user, url }) => {
			await sendResetPasswordEmail({ ...env, to: user.email, url })
		},
		sendVerificationEmail: async ({ user, url }) => {
			await sendVerificationEmail({ ...env, to: user.email, url })
		},
		sendVerificationOTP: async ({ email, otp, type }) => {
			// send OTP email
			await sendOTPVerification({ ...env, to: email, otp, type })
		}
	})
	return betterAuth({
		...options,
		advanced: {
			database: {
				generateId: false
			}
		}
	} as any) // Temporary cast if you cannot control the prompt value, but ideally fix the prompt value in betterAuthOptions
}
