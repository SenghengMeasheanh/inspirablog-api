import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Text
} from "@react-email/components"
import { text } from "drizzle-orm/gel-core"
import { cautionText } from "./styles"

interface Props {
	title: string
	heading: string
	children: React.ReactNode
}

export default function Layout({ title, heading, children }: Props) {
	const logoUrl = ""
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>{title}</Preview>
				<Container style={container}>
					<Section style={coverSection}>
						<Section style={imageSection}>
							<Img src={logoUrl} width="75" height="45" alt="Plumpi's Logo" />
						</Section>
						<Section style={upperSection}>
							<Heading style={h1}>{heading}</Heading>
							{children}
						</Section>
						<Hr />
						<Section style={lowerSection}>
							<Text style={cautionText}>
								Plumpi will never email you and ask you to disclose or verify
								your password, credit card, or banking account number.
							</Text>
						</Section>
					</Section>
					<Text style={footerText}>
						This message was produced and distributed by Plumpi Events.
					</Text>
				</Container>
			</Body>
		</Html>
	)
}

const main = {
	backgroundColor: "#fff",
	color: "#212121"
}

const container = {
	padding: "20px",
	margin: "0 auto",
	backgroundColor: "#eee"
}

const h1 = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "20px",
	fontWeight: "bold",
	marginBottom: "15px"
}

const imageSection = {
	backgroundColor: "#252f3d",
	display: "flex",
	padding: "20px 0",
	alignItems: "center",
	justifyContent: "center"
}

const coverSection = { backgroundColor: "#fff" }

const upperSection = { padding: "25px 35px" }

const lowerSection = { padding: "25px 35px" }

const footerText = {
	...text,
	fontSize: "12px",
	padding: "0 20px"
}
