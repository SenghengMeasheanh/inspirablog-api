import { Section, Text } from "@react-email/components"
import Layout from "./inc/layout"
import {
  codeText,
  mainText,
  validityText,
  verificationSection,
  verifyText
} from "./inc/styles"

export function VerificationOTPCodeEmail(otp: string) {
  return (
    <Layout title="Verify your OTP code" heading="Verify your OTP code">
      <Text style={mainText}>
        Thanks for starting the new account creation process. We want to make
        sure it's really you. Please enter the following OTP code to confirm. If
        you don&apos;t want to create an account, you can ignore this message.
      </Text>
      <Section style={verificationSection}>
        <Text style={verifyText}>Verification code</Text>
        <Text style={codeText}>{otp}</Text>
        <Text style={validityText}>(This code is valid for 10 minutes)</Text>
      </Section>
    </Layout>
  )
}
