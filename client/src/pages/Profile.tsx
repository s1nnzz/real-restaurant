import { createSignal, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";

export default function Profile() {
	const { user, loading } = useAuth();
	const { setFlash } = useFlash();

	const [userData, setUserData] = createSignal<any>(null);
	const [dataLoading, setDataLoading] = createSignal(true);

	onMount(async () => {
		if (user()) {
			try {
				const response = await fetch("/api/userdata", {
					method: "POST",
				});

				if (response.ok) {
					const data = await response.json();
					setUserData(data);
				} else {
					setFlash("Failed to load profile data", "error");
				}
			} catch (error) {
				setFlash("Error loading profile", "error");
			} finally {
				setDataLoading(false);
			}
		} else {
			setDataLoading(false);
		}
	});

	return (
		<div class="profile-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">My Profile</h1>
					<p class="page-header__subtitle">
						Manage your account details
					</p>
				</div>
			</div>

			<div class="container">
				<Show when={loading() || dataLoading()}>
					<div class="loading">
						<div class="spinner"></div>
						<p>Loading profile...</p>
					</div>
				</Show>

				<Show when={!loading() && !dataLoading()}>
					<Show
						when={user()}
						fallback={
							<div class="empty-state">
								<h3 class="empty-state__title">
									Please Sign In
								</h3>
								<p class="empty-state__text">
									You need to be logged in to view your
									profile.
								</p>
							</div>
						}
					>
						<div class="profile-card">
							<div class="profile-field">
								<span class="profile-field__label">Email</span>
								<span class="profile-field__value">
									{userData()?.email || user()?.email}
								</span>
							</div>

							<div class="profile-field">
								<span class="profile-field__label">
									Member ID
								</span>
								<span class="profile-field__value">
									#{user()?.id}
								</span>
							</div>

							<div class="profile-field">
								<span class="profile-field__label">
									Member Since
								</span>
								<span class="profile-field__value">
									{userData()?.created_at
										? new Date(
												userData().created_at
										  ).toLocaleDateString("en-GB", {
												year: "numeric",
												month: "long",
												day: "numeric",
										  })
										: "N/A"}
								</span>
							</div>

							<div class="profile-actions">
								<A href="/bookings" class="btn btn--primary">
									View Reservations
								</A>
								<A href="/delete" class="btn btn--outline">
									Delete Account
								</A>
							</div>
						</div>
					</Show>
				</Show>
			</div>
		</div>
	);
}
