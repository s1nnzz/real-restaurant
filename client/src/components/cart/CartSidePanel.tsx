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
			<div
				class={`cart-overlay ${
					isPanelOpen() ? "cart-overlay--open" : ""
				}`}
				onClick={closePanel}
			/>

			{/* Side Panel */}
			<div
				class={`cart-panel ${isPanelOpen() ? "cart-panel--open" : ""}`}
			>
				<div class="cart-panel__header">
					<h2>Your Cart ({itemCount()})</h2>
					<button
						class="cart-panel__close"
						onClick={closePanel}
						aria-label="Close cart"
					>
						✕
					</button>
				</div>

				<div class="cart-panel__content">
					<Show
						when={!isLoading()}
						fallback={
							<div class="loading">
								<div class="spinner"></div>
								<p>Loading cart...</p>
							</div>
						}
					>
						<Show
							when={cartWithDetails().length > 0}
							fallback={
								<div class="empty-state">
									<p class="empty-state__text">
										Your cart is empty
									</p>
									<button
										class="btn btn--primary"
										onClick={closePanel}
									>
										Continue Shopping
									</button>
								</div>
							}
						>
							<div class="cart-panel__items">
								<For each={cartWithDetails()}>
									{(item) => (
										<Show when={item.details}>
											<div class="cart-panel__item">
												<div class="cart-panel__item-info">
													<h4 class="cart-panel__item-name">
														{item.details!.name}
													</h4>
													<p class="cart-panel__item-price">
														£
														{Number(
															item.details!.price
														).toFixed(2)}{" "}
														each
													</p>
												</div>
												<div class="cart-panel__item-controls">
													<div class="quantity-control">
														<button
															class="quantity-control__btn"
															onClick={() =>
																updateQuantity(
																	item.menuItemId,
																	item.quantity -
																		1
																)
															}
															aria-label="Decrease quantity"
														>
															-
														</button>
														<span class="quantity-control__value">
															{item.quantity}
														</span>
														<button
															class="quantity-control__btn"
															onClick={() =>
																updateQuantity(
																	item.menuItemId,
																	item.quantity +
																		1
																)
															}
															aria-label="Increase quantity"
														>
															+
														</button>
													</div>
													<span class="cart-panel__item-subtotal">
														£
														{(
															Number(
																item.details!
																	.price
															) * item.quantity
														).toFixed(2)}
													</span>
													<button
														class="cart-panel__item-remove"
														onClick={() =>
															removeItem(
																item.menuItemId
															)
														}
														aria-label="Remove item"
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
					<div class="cart-panel__footer">
						<div class="cart-panel__total">
							<strong>Total:</strong>
							<span class="cart-panel__total-amount">
								£{total().toFixed(2)}
							</span>
						</div>
						<div class="cart-panel__actions">
							<button
								class="btn btn--secondary"
								onClick={clearCart}
							>
								Clear Cart
							</button>
							<Show
								when={user()}
								fallback={
									<A
										href="/login"
										class="btn btn--primary"
										onClick={closePanel}
									>
										Login to Checkout
									</A>
								}
							>
								<button
									class="btn btn--primary"
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
