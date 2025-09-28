import { Section, Text } from "@react-email/components"
import Layout from "./inc/layout"
import {
  codeText,
  mainText,
  validityText,
  verificationSection,
  verifyText
} from "./inc/styles"

export function ResetPasswordLinkEmail(otp: string) {
  return (
    <Layout
      title="Verify your email address"
      heading="Verify your email address">
      <Text style={mainText}>
        We received a request to reset your password. Please use the
        verification code below to proceed with resetting your password. If you
        didn&apos;t request this, you can safely ignore this message.
      </Text>
      <Section style={verificationSection}>
        <Text style={verifyText}>Verification code</Text>
        <Text style={codeText}>{otp}</Text>
        <Text style={validityText}>(This code is valid for 10 minutes)</Text>
      </Section>
    </Layout>
  )
}
