export const text = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "24px 0"
}

export const link = {
	color: "#2754C5",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	textDecoration: "underline"
}

export const verifyText = {
	...text,
	margin: 0,
	fontWeight: "bold",
	textAlign: "center" as const
}

export const validityText = {
	...text,
	margin: "0px",
	textAlign: "center" as const
}

export const verificationSection = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center"
}

export const cautionText = { ...text, margin: "0px" }

export const mainText = { ...text, marginBottom: "14px" }
