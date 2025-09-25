import { Resend } from "resend"

export interface IEMail {
	to: string | string[]
	APP_NAME: string
	RESEND_API_KEY: string
	RESEND_FROM?: string
}

interface ISendEmail extends IEMail {
	subject: string
	react: React.ReactNode
}

export async function sendEmail(param: ISendEmail) {
	const { to, subject, react } = param
	const resend = new Resend(param.RESEND_API_KEY)
	const from = param.RESEND_FROM ?? `no-reply@${param.APP_NAME}`
	return await resend.emails.send({ from, to, subject, react })
}

export * from "./auth"
