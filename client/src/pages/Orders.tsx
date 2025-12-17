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
		<div>
			<h1>Your Orders</h1>

			<Show when={!authLoading()}>
				<Show
					when={user()}
					fallback={
						<div>
							<p>Please log in to view your orders.</p>
							<A href="/login">Login</A>
						</div>
					}
				>
					<Show
						when={!orders.loading}
						fallback={<p>Loading orders...</p>}
					>
						<Show when={orders()}>
							{(orderList) => (
								<Show
									when={orderList().length > 0}
									fallback={
										<div>
											<p>
												You haven't placed any orders
												yet.
											</p>
											<A href="/menu">Browse Menu</A>
										</div>
									}
								>
									<div>
										<For each={orderList()}>
											{(order) => (
												<div>
													<div>
														<span>
															Order #{order.id}
														</span>
														<span>
															{order.status
																.charAt(0)
																.toUpperCase() +
																order.status.slice(
																	1
																)}
														</span>
													</div>
													<div>
														<p>
															{formatDate(
																order.created_at
															)}
														</p>
														<p>
															<strong>
																Total:
															</strong>{" "}
															£
															{Number(
																order.total
															).toFixed(2)}
														</p>
													</div>
												</div>
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
	);
}
