import { createResource, Show } from "solid-js";
import { A, useSearchParams } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export default function CheckoutSuccess() {
	const { user } = useAuth();
	const [searchParams] = useSearchParams();

	const verifyPayment = async () => {
		const sessionId = searchParams.session_id;
		if (!sessionId) return { success: false, status: "missing_session" };

		const res = await fetch(`/api/checkout/verify/${sessionId}`);
		if (!res.ok) return { success: false, status: "error" };
		return res.json();
	};

	const [verification] = createResource(() => user(), verifyPayment);

	return (
		<div class="status-page">
			<div class="status-card">
				<Show
					when={!verification.loading}
					fallback={
						<div class="loading">
							<div class="spinner"></div>
							<p>Verifying payment...</p>
						</div>
					}
				>
					<Show
						when={verification()?.success}
						fallback={
							<>
								<div class="status-card__icon status-card__icon--warning">
									⚠️
								</div>
								<h1 class="status-card__title">
									Payment Verification
								</h1>
								<p class="status-card__text">
									We couldn't verify your payment status.
									Please check your orders.
								</p>
								<div class="status-card__actions">
									<A href="/orders" class="btn btn--primary">
										View Orders
									</A>
									<A href="/" class="btn btn--secondary">
										Go Home
									</A>
								</div>
							</>
						}
					>
						<div class="status-card__icon status-card__icon--success">
							🎉
						</div>
						<h1 class="status-card__title">Payment Successful!</h1>
						<p class="status-card__text">
							Thank you for your order. Your payment has been
							processed successfully.
						</p>
						<Show when={verification()?.orderId}>
							<p class="status-card__order-id">
								Order #{verification()?.orderId}
							</p>
						</Show>
						<div class="status-card__actions">
							<A href="/orders" class="btn btn--primary">
								View Orders
							</A>
							<A href="/menu" class="btn btn--secondary">
								Continue Shopping
							</A>
						</div>
					</Show>
				</Show>
			</div>
		</div>
	);
}
