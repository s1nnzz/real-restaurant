import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

interface Order {
	id: number;
	user_id: number;
	stripe_session_id: string | null;
	status: "pending" | "paid" | "cancelled" | "refunded";
	total: number;
	created_at: string;
}

export default function Orders() {
	const { user, loading: authLoading } = useAuth();

	const fetchOrders = async (): Promise<Order[]> => {
		const res = await fetch("/api/orders");
		if (!res.ok) throw new Error("Failed to fetch orders");
		const data = await res.json();
		return data.orders;
	};

	const [orders] = createResource(() => user(), fetchOrders);

	const statusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "status-success";
			case "pending":
				return "status-warning";
			case "cancelled":
				return "status-error";
			case "refunded":
				return "status-info";
			default:
				return "";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div class="orders-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">Order History</h1>
					<p class="page-header__subtitle">View your past orders</p>
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
									You need to be logged in to view your
									orders.
								</p>
								<A href="/login" class="btn btn--primary">
									Sign In
								</A>
							</div>
						}
					>
						<Show
							when={!orders.loading}
							fallback={
								<div class="loading">
									<div class="spinner"></div>
									<p>Loading orders...</p>
								</div>
							}
						>
							<Show when={orders()}>
								{(orderList) => (
									<Show
										when={orderList().length > 0}
										fallback={
											<div class="empty-state">
												<svg
													class="empty-state__icon"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="1.5"
												>
													<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
													<polyline points="14 2 14 8 20 8" />
													<line
														x1="16"
														y1="13"
														x2="8"
														y2="13"
													/>
													<line
														x1="16"
														y1="17"
														x2="8"
														y2="17"
													/>
													<polyline points="10 9 9 9 8 9" />
												</svg>
												<h3 class="empty-state__title">
													No Orders Yet
												</h3>
												<p class="empty-state__text">
													You haven't placed any
													orders yet. Start browsing
													our menu!
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
										<div class="orders-list">
											<For each={orderList()}>
												{(order) => (
													<article class="order-card">
														<div class="order-card__header">
															<div>
																<span class="order-card__id">
																	Order #
																	{order.id}
																</span>
																<p class="order-card__date">
																	{formatDate(
																		order.created_at
																	)}
																</p>
															</div>
															<span
																class={`status status--${statusColor(
																	order.status
																).replace(
																	"status-",
																	""
																)}`}
															>
																{order.status
																	.charAt(0)
																	.toUpperCase() +
																	order.status.slice(
																		1
																	)}
															</span>
														</div>
														<div class="order-card__total">
															£
															{Number(
																order.total
															).toFixed(2)}
														</div>
													</article>
												)}
											</For>
										</div>
									</Show>
								)}
							</Show>
						</Show>
					</Show>
				</Show>
			</div>
		</div>
	);
}
