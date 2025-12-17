import { createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useFlash } from "../../contexts/FlashContext";

export default function CartSidePanel() {
	const { user } = useAuth();
	const { setFlash } = useFlash();
	const {
		cartWithDetails,
		updateQuantity,
		removeItem,
		clearCart,
		itemCount,
		total,
		isLoading,
		isPanelOpen,
		closePanel,
	} = useCart();

	const [checkingOut, setCheckingOut] = createSignal(false);

	const checkout = async () => {
		if (!user()) {
			setFlash("Please log in to checkout", "error");
			return;
		}

		setCheckingOut(true);

		try {
			// Send cart items to server for checkout
			const cartItems = cartWithDetails().map((item) => ({
				menuItemId: item.menuItemId,
				quantity: item.quantity,
			}));

			const res = await fetch("/api/checkout/create-session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ items: cartItems }),
			});

			if (res.ok) {
				const data = await res.json();
				if (data.url) {
					clearCart();
					window.location.href = data.url;
				}
			} else {
				const data = await res.json();
				setFlash(
					data.message || "Failed to create checkout session",
					"error"
				);
			}
		} catch (error) {
			setFlash("Failed to create checkout session", "error");
		} finally {
			setCheckingOut(false);
		}
	};

	return (
		<>
			{/* Overlay */}
			<div onClick={closePanel} />

			{/* Side Panel */}
			<div>
				<div>
					<h2>Your Cart ({itemCount()})</h2>
					<button onClick={closePanel}>✕</button>
				</div>

				<div>
					<Show when={!isLoading()} fallback={<p>Loading cart...</p>}>
						<Show
							when={cartWithDetails().length > 0}
							fallback={
								<div>
									<p>Your cart is empty</p>
									<button onClick={closePanel}>
										Continue Shopping
									</button>
								</div>
							}
						>
							<div>
								<For each={cartWithDetails()}>
									{(item) => (
										<Show when={item.details}>
											<div>
												<div>
													<h4>
														{item.details!.name}
													</h4>
													<p>
														£
														{Number(
															item.details!.price
														).toFixed(2)}{" "}
														each
													</p>
												</div>
												<div>
													<div>
														<button
															onClick={() =>
																updateQuantity(
																	item.menuItemId,
																	item.quantity -
																		1
																)
															}
														>
															-
														</button>
														<span>
															{item.quantity}
														</span>
														<button
															onClick={() =>
																updateQuantity(
																	item.menuItemId,
																	item.quantity +
																		1
																)
															}
														>
															+
														</button>
													</div>
													<span>
														£
														{(
															Number(
																item.details!
																	.price
															) * item.quantity
														).toFixed(2)}
													</span>
													<button
														onClick={() =>
															removeItem(
																item.menuItemId
															)
														}
													>
														✕
													</button>
												</div>
											</div>
										</Show>
									)}
								</For>
							</div>
						</Show>
					</Show>
				</div>

				<Show when={cartWithDetails().length > 0}>
					<div>
						<div>
							<strong>Total:</strong>
							<span>£{total().toFixed(2)}</span>
						</div>
						<div>
							<button onClick={clearCart}>Clear Cart</button>
							<Show
								when={user()}
								fallback={
									<A href="/login" onClick={closePanel}>
										Login to Checkout
									</A>
								}
							>
								<button
									onClick={checkout}
									disabled={checkingOut()}
								>
									{checkingOut()
										? "Processing..."
										: "Checkout"}
								</button>
							</Show>
						</div>
					</div>
				</Show>
			</div>
		</>
	);
}
