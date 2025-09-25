import { Link, Section, Text } from "@react-email/components"
import Layout from "./inc/layout"
import {
	link,
	mainText,
	validityText,
	verificationSection,
	verifyText
} from "./inc/styles"

export function VerificationLinkEmail(url: string) {
	return (
		<Layout
			title="Verify your email address"
			heading="Verify your email address">
			<Text style={mainText}>
				Thanks for starting the new account creation process. We want to make
				sure it's really you. Please click the following verification link to
				confirm. If you don&apos;t want to create an account, you can ignore
				this message.
			</Text>
			<Section style={verificationSection}>
				<Text style={verifyText}>Verification Link</Text>
				<Link href={url} style={link}>
					Click here to verify your email
				</Link>
				<Text style={validityText}>(This link is valid for 10 minutes)</Text>
			</Section>
		</Layout>
	)
}
