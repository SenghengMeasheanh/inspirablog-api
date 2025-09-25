import { Section, Text } from "@react-email/components"
import Layout from "./inc/layout"

interface Props {
	orderNumber: string
	orderDate: string
	totalPrice: string
	currencyCode: string
}

export function orderConfirmedEmail(args: Props) {
	const { orderNumber, orderDate, totalPrice, currencyCode } = args
	return (
		<Layout
			title="Your Order Confirmation"
			heading="Thank you for your payment">
			<Text>Hi,</Text>

			<Text>
				Thank you for your payment. We have received your payment and your order
				is being processed.
			</Text>

			<Text>Order Details:</Text>

			<Section>
				<Text>Order Number: {orderNumber}</Text>
				<Text>Date: {orderDate}</Text>
				<Text>
					Total Price: {currencyCode} {totalPrice}
				</Text>
			</Section>

			<Text>
				If you have any questions or concerns, please don't hesitate to contact
				us.
			</Text>
			<Text>Thank you.</Text>
		</Layout>
	)
}
