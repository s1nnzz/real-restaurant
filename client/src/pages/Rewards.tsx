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
		<div>
			<h1>Your Rewards</h1>

			<Show when={!authLoading()}>
				<Show
					when={user()}
					fallback={
						<div>
							<p>Please log in to view your rewards.</p>
							<A href="/login">Login</A>
						</div>
					}
				>
					<Show
						when={!rewardsData.loading}
						fallback={<p>Loading rewards...</p>}
					>
						<Show when={rewardsData()}>
							{(data) => (
								<>
									<div>
										<div>
											<span>Available Balance</span>
											<span>
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
										</div>
										<p>
											Earn £2 for every £10 you spend! Use
											your rewards at checkout to save
											money.
										</p>
									</div>

									<Show
										when={data().rewards.length > 0}
										fallback={
											<div>
												<p>
													You don't have any rewards
													yet.
												</p>
												<p>
													Place an order of £10 or
													more to start earning!
												</p>
												<A href="/menu">Browse Menu</A>
											</div>
										}
									>
										<h2>Reward History</h2>
										<div>
											<For each={data().rewards}>
												{(reward) => (
													<div>
														<div>
															<span>
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
															</span>
															<span>
																{formatDate(
																	reward.created_at
																)}
															</span>
														</div>
														<div>
															<Show
																when={
																	reward.used
																}
																fallback={
																	<span>
																		Available
																	</span>
																}
															>
																<span>
																	Used on
																	Order #
																	{
																		reward.used_on_order_id
																	}
																</span>
															</Show>
														</div>
														<div>
															From Order #
															{
																reward.from_order_id
															}
														</div>
													</div>
												)}
											</For>
										</div>
									</Show>
								</>
							)}
						</Show>
					</Show>
				</Show>
			</Show>
		</div>
	);
}
