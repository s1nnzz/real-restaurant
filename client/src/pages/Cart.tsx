import { createSignal, createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import { useCart } from "../contexts/CartContext";

interface RewardsBalance {
	balance: number;
}

export default function Cart() {
	const { user, loading: authLoading } = useAuth();
	const { setFlash } = useFlash();
	const {
		cartWithDetails,
		updateQuantity,
		removeItem,
		clearCart,
		total,
		isLoading,
	} = useCart();
	const [checkingOut, setCheckingOut] = createSignal(false);
	const [useRewards, setUseRewards] = createSignal(false);

	const fetchRewardsBalance = async (): Promise<number> => {
		const res = await fetch("/api/rewards/balance");
		if (!res.ok) return 0;
		const data: RewardsBalance = await res.json();
		return data.balance;
	};

	const [rewardsBalance] = createResource(() => user(), fetchRewardsBalance);

	const rewardsDiscount = () => {
		if (!useRewards()) return 0;
		const balance = rewardsBalance() || 0;
		return Math.min(balance, total());
	};

	const finalTotal = () => {
		return total() - rewardsDiscount();
	};

	const checkout = async () => {
		if (!user()) {
			setFlash("Please log in to checkout", "error");
			return;
		}

		setCheckingOut(true);

		try {
			const cartItems = cartWithDetails().map((item) => ({
				menuItemId: item.menuItemId,
				quantity: item.quantity,
			}));

			const res = await fetch("/api/checkout/create-session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: cartItems,
					useRewards: useRewards(),
				}),
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
		<div class="cart-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">Your Cart</h1>
					<p class="page-header__subtitle">
						Review your order before checkout
					</p>
				</div>
			</div>

			<div class="container">
				<Show when={!authLoading()}>
					<Show
						when={user()}
						fallback={
							<div class="empty-state">
								<h3 class="empty-state__title">
									Please Sign In
								</h3>
								<p class="empty-state__text">
									You need to be logged in to view your cart.
								</p>
								<A href="/login" class="btn btn--primary">
									Sign In
								</A>
							</div>
						}
					>
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
										<svg
											class="empty-state__icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
										>
											<circle cx="9" cy="21" r="1" />
											<circle cx="20" cy="21" r="1" />
											<path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
										</svg>
										<h3 class="empty-state__title">
											Your Cart is Empty
										</h3>
										<p class="empty-state__text">
											Discover our menu and add some
											delicious dishes.
										</p>
										<A
											href="/menu"
											class="btn btn--primary"
										>
											Browse Menu
										</A>
									</div>
								}
							>
								<div class="cart-list">
									<For each={cartWithDetails()}>
										{(item) => (
											<Show when={item.details}>
												<div class="cart-item">
													<div class="cart-item__info">
														<h3 class="cart-item__name">
															{item.details!.name}
														</h3>
														<p class="cart-item__price">
															£
															{Number(
																item.details!
																	.price
															).toFixed(2)}{" "}
															each
														</p>
													</div>
													<div class="cart-item__controls">
														<div class="quantity-control">
															<button
																onClick={() =>
																	updateQuantity(
																		item.menuItemId,
																		item.quantity -
																			1
																	)
																}
															>
																−
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
														<span class="cart-item__total">
															£
															{(
																Number(
																	item.details!
																		.price
																) *
																item.quantity
															).toFixed(2)}
														</span>
														<button
															class="cart-item__remove"
															onClick={() =>
																removeItem(
																	item.menuItemId
																)
															}
															aria-label="Remove item"
														>
															×
														</button>
													</div>
												</div>
											</Show>
										)}
									</For>
								</div>

								<div class="cart-summary">
									<Show when={(rewardsBalance() || 0) > 0}>
										<div class="checkbox-group">
											<input
												type="checkbox"
												id="use-rewards"
												checked={useRewards()}
												onChange={(e) =>
													setUseRewards(
														e.currentTarget.checked
													)
												}
											/>
											<label for="use-rewards">
												Use rewards (£
												{Number(
													rewardsBalance()
												).toFixed(2)}{" "}
												available)
											</label>
										</div>
									</Show>

									<Show
										when={
											useRewards() &&
											rewardsDiscount() > 0
										}
									>
										<div class="cart-summary__row">
											<span>Subtotal</span>
											<span>£{total().toFixed(2)}</span>
										</div>
										<div class="cart-summary__row cart-summary__discount">
											<span>Rewards Discount</span>
											<span>
												-£{rewardsDiscount().toFixed(2)}
											</span>
										</div>
									</Show>

									<div class="cart-summary__row cart-summary__row--total">
										<span>Total</span>
										<span>£{finalTotal().toFixed(2)}</span>
									</div>

									<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
										<button
											class="btn btn--outline"
											onClick={clearCart}
										>
											Clear Cart
										</button>
										<button
											class="btn btn--primary"
											style="flex: 1;"
											onClick={checkout}
											disabled={checkingOut()}
										>
											{checkingOut()
												? "Processing..."
												: "Proceed to Checkout"}
										</button>
									</div>
								</div>
							</Show>
						</Show>
					</Show>
				</Show>
			</div>
		</div>
	);
}
