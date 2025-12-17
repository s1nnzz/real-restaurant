import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

interface Reward {
	id: number;
	user_id: number;
	amount: number;
	from_order_id: number;
	used: boolean;
	used_on_order_id: number | null;
	created_at: string;
}

interface RewardsResponse {
	rewards: Reward[];
	availableTotal: number;
}

export default function Rewards() {
	const { user, loading: authLoading } = useAuth();

	const fetchRewards = async (): Promise<RewardsResponse> => {
		const res = await fetch("/api/rewards");
		if (!res.ok) throw new Error("Failed to fetch rewards");
		return res.json();
	};

	const [rewardsData] = createResource(() => user(), fetchRewards);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-GB", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div class="rewards-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">Your Rewards</h1>
					<p class="page-header__subtitle">
						Earn rewards with every order
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
									You need to be logged in to view your
									rewards.
								</p>
								<A href="/login" class="btn btn--primary">
									Sign In
								</A>
							</div>
						}
					>
						<Show
							when={!rewardsData.loading}
							fallback={
								<div class="loading">
									<div class="spinner"></div>
									<p>Loading rewards...</p>
								</div>
							}
						>
							<Show when={rewardsData()}>
								{(data) => (
									<>
										<div class="rewards-balance">
											<span class="rewards-balance__amount">
												£
												{Number(data().availableTotal) %
													1 ===
												0
													? Number(
															data()
																.availableTotal
													  )
													: Number(
															data()
																.availableTotal
													  ).toFixed(2)}
											</span>
											<p class="rewards-balance__label">
												Available Balance
											</p>
										</div>

										<div class="rewards-info">
											<p class="text-center mb-lg">
												Earn{" "}
												<strong class="text-accent">
													£2
												</strong>{" "}
												for every <strong>£10</strong>{" "}
												you spend! Use your rewards at
												checkout to save on your next
												order.
											</p>

											<Show
												when={data().rewards.length > 0}
												fallback={
													<div class="empty-state">
														<svg
															class="empty-state__icon"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="1.5"
														>
															<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
														</svg>
														<h3 class="empty-state__title">
															Start Earning
															Rewards
														</h3>
														<p class="empty-state__text">
															Place an order of
															£10 or more to earn
															your first rewards!
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
												<h2 class="mt-xl mb-lg">
													Reward History
												</h2>
												<div class="orders-list">
													<For each={data().rewards}>
														{(reward) => (
															<div class="order-card">
																<div class="order-card__header">
																	<div>
																		<span class="order-card__id">
																			From
																			Order
																			#
																			{
																				reward.from_order_id
																			}
																		</span>
																		<p class="order-card__date">
																			{formatDate(
																				reward.created_at
																			)}
																		</p>
																	</div>
																	<span
																		class={`status ${
																			reward.used
																				? "status--info"
																				: "status--success"
																		}`}
																	>
																		{reward.used
																			? `Used on #${reward.used_on_order_id}`
																			: "Available"}
																	</span>
																</div>
																<div class="order-card__total">
																	£
																	{Number(
																		reward.amount
																	) %
																		1 ===
																	0
																		? Number(
																				reward.amount
																		  )
																		: Number(
																				reward.amount
																		  ).toFixed(
																				2
																		  )}
																</div>
															</div>
														)}
													</For>
												</div>
											</Show>
										</div>
									</>
								)}
							</Show>
						</Show>
					</Show>
				</Show>
			</div>
		</div>
	);
}
