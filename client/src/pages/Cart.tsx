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
		<div>
			<h1>Your Cart</h1>

			<Show when={!authLoading()}>
				<Show
					when={user()}
					fallback={
						<div>
							<p>Please log in to view your cart.</p>
							<A href="/login">Login</A>
						</div>
					}
				>
					<Show when={!isLoading()} fallback={<p>Loading cart...</p>}>
						<Show
							when={cartWithDetails().length > 0}
							fallback={
								<div>
									<p>Your cart is empty.</p>
									<A href="/menu">Browse Menu</A>
								</div>
							}
						>
							<div>
								<For each={cartWithDetails()}>
									{(item) => (
										<Show when={item.details}>
											<div>
												<div>
													<h3>
														{item.details!.name}
													</h3>
													<p>
														£
														{Number(
															item.details!.price
														).toFixed(2)}{" "}
														each
													</p>
												</div>
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
													<span>{item.quantity}</span>
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
														Remove
													</button>
												</div>
											</div>
										</Show>
									)}
								</For>
							</div>

							<div>
								<Show when={(rewardsBalance() || 0) > 0}>
									<div>
										<label>
											<input
												type="checkbox"
												checked={useRewards()}
												onChange={(e) =>
													setUseRewards(
														e.currentTarget.checked
													)
												}
											/>
											<span>
												Use rewards (£
												{Number(
													rewardsBalance()
												).toFixed(2)}{" "}
												available)
											</span>
										</label>
										<Show
											when={
												useRewards() &&
												rewardsDiscount() > 0
											}
										>
											<div>
												Rewards discount: -£
												{rewardsDiscount().toFixed(2)}
											</div>
										</Show>
									</div>
								</Show>

								<div>
									<Show
										when={
											useRewards() &&
											rewardsDiscount() > 0
										}
									>
										<div>
											<span>Subtotal:</span> £
											{total().toFixed(2)}
										</div>
									</Show>
									<strong>Total:</strong> £
									{finalTotal().toFixed(2)}
								</div>
								<div>
									<button onClick={clearCart}>
										Clear Cart
									</button>
									<button
										onClick={checkout}
										disabled={checkingOut()}
									>
										{checkingOut()
											? "Processing..."
											: "Checkout"}
									</button>
								</div>
							</div>
						</Show>
					</Show>
				</Show>
			</Show>
		</div>
	);
}
