interface Args {
	secret: string
	data: object
}
interface GetArgs extends Args {
	expiresIn?: number
}

function hexToArray(value: string) {
	const hexPairs = value.match(/.{1,2}/g) || []
	return new Uint8Array(hexPairs.map((byte) => Number.parseInt(byte, 16)))
}

function arrayToHex(arr: Uint8Array) {
	return Array.from(arr)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}

async function getKey(secret: string, data: object) {
	const encoder = new TextEncoder()
	const keyData = encoder.encode(secret)
	const algo = { name: "HMAC", hash: "SHA-256" }
	const usages = ["sign", "verify"]
	const key = await crypto.subtle.importKey("raw", keyData, algo, false, usages)
	const encodedData = encoder.encode(JSON.stringify(data))
	return { key, encodedData }
}

export async function getToken(args: GetArgs): Promise<string> {
	const { secret, data, expiresIn } = args
	const twenty24h = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
	const expiresAt = Date.now() + (expiresIn ?? twenty24h) // default is 24 hours
	const dataWithExpiry = { ...data, expiresAt }
	const { key, encodedData } = await getKey(secret, dataWithExpiry)
	const digest = await crypto.subtle.sign("HMAC", key, encodedData)
	const hashArray = new Uint8Array(digest)
	const token = arrayToHex(hashArray) // hex
	const encodedHex = arrayToHex(encodedData) // hex
	return `${token}.${encodedHex}`
}

export async function verifyToken(args: {
	secret: string
	token: string
}): Promise<{ valid: boolean; data: object | null }> {
	const { secret, token } = args
	try {
		const parts = token.split(".")
		if (parts.length !== 2) return { valid: false, data: null }

		const [hexSignature, encodedHex] = parts
		const dataBytes = hexToArray(encodedHex)
		const decodedData = JSON.parse(new TextDecoder().decode(dataBytes))

		if (Date.now() > decodedData.expiresAt) return { valid: false, data: null }

		const { key, encodedData } = await getKey(secret, decodedData)
		const signature = hexToArray(hexSignature)
		const isValid = await crypto.subtle.verify(
			"HMAC",
			key,
			signature,
			encodedData
		)

		if (!isValid) return { valid: false, data: null }

		const { expiresAt: _expiresAt, ...data } = decodedData
		return { valid: true, data }
	} catch {
		return { valid: false, data: null }
	}
}
