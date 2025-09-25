import { type IEMail, sendEmail } from "."
import { ResetPasswordLinkEmail, VerificationLinkEmail } from "./templates"

interface ISendLink extends IEMail {
	to: string | string[]
	url: string
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
