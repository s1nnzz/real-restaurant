import { A } from "@solidjs/router";

export default function CheckoutCancelled() {
	return (
		<div>
			<div>
				<h1>❌ Checkout Cancelled</h1>
				<p>Your payment was cancelled. No charges have been made.</p>
				<p>
					Your cart items have been saved if you'd like to try again.
				</p>
				<div>
					<A href="/cart">Return to Cart</A>
					<A href="/menu">Continue Shopping</A>
				</div>
			</div>
		</div>
	);
}
