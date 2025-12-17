import { A } from "@solidjs/router";

export default function CheckoutCancelled() {
	return (
		<div class="status-page">
			<div class="status-card">
				<div class="status-card__icon status-card__icon--error">❌</div>
				<h1 class="status-card__title">Checkout Cancelled</h1>
				<p class="status-card__text">
					Your payment was cancelled. No charges have been made.
				</p>
				<p class="status-card__text">
					Your cart items have been saved if you'd like to try again.
				</p>
				<div class="status-card__actions">
					<A href="/cart" class="btn btn--primary">
						Return to Cart
					</A>
					<A href="/menu" class="btn btn--secondary">
						Continue Shopping
					</A>
				</div>
			</div>
		</div>
	);
}
