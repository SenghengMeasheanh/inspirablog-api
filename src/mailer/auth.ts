import { type IEMail, sendEmail } from "."
import { ResetPasswordLinkEmail, VerificationLinkEmail, VerificationOTPCodeEmail } from "./templates"

interface ISendLink extends IEMail {
	to: string | string[]
	url: string
}

interface ISendOTP extends IEMail {
	to: string | string[]
	otp: string
	type: "sign-in" | "email-verification" | "forget-password"
}

export async function sendVerificationEmail(args: ISendLink) {
	const { to, url } = args
	const subject = "Verify your Email"
	const react = VerificationLinkEmail(url)
	await sendEmail({ ...args, to, subject, react })
}

export async function sendResetPasswordEmail(args: ISendLink) {
	const { to, url } = args
	const subject = "Reset your Password"
	const react = ResetPasswordLinkEmail(url)
	await sendEmail({ ...args, to, subject, react })
}

export async function sendOTPVerification(args: ISendOTP) {
	const { to, otp, type } = args
	const subject = "Verify your email with OTP code"
	if (type === "email-verification") {
		const react = VerificationOTPCodeEmail(otp)
		await sendEmail({ ...args, to, subject, react })
	} else if (type === "forget-password") {
		const react = ResetPasswordLinkEmail(otp)
		await sendEmail({ ...args, to, subject, react })
	}
}
