import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
	const { user, loading } = useAuth();

	return (
		<>
			{/* Hero Section */}
			<section class="hero">
				<div class="hero__content">
					<span class="hero__subtitle">European Fine Dining</span>
					<h1 class="hero__title">
						La Maison Bleue
						<span>Where every meal tells a story</span>
					</h1>
					<p class="hero__description">
						Discover refined Continental cuisine crafted with
						passion, served in an atmosphere of understated
						elegance.
					</p>

					<Show when={!loading()}>
						<div class="hero__actions">
							<Show
								when={user()}
								fallback={
									<>
										<A
											href="/register"
											class="btn btn--primary"
										>
											Make a Reservation
										</A>
										<A
											href="/menu"
											class="btn btn--secondary"
										>
											View Our Menu
										</A>
									</>
								}
							>
								<A href="/book" class="btn btn--primary">
									Book a Table
								</A>
								<A href="/menu" class="btn btn--secondary">
									View Menu
								</A>
							</Show>
						</div>
					</Show>
				</div>
			</section>

			{/* Features Section */}
			<section class="features">
				<div class="divider">
					<span class="divider__line"></span>
					<span class="divider__diamond"></span>
					<span class="divider__line"></span>
				</div>

				<div class="features__grid">
					<div class="feature-card">
						<svg
							class="feature-card__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
						</svg>
						<h3 class="feature-card__title">
							Effortless Reservations
						</h3>
						<p class="feature-card__text">
							Secure your table in moments. Choose your preferred
							time, party size, and let us handle the rest.
						</p>
					</div>

					<div class="feature-card">
						<svg
							class="feature-card__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
						</svg>
						<h3 class="feature-card__title">Curated Menu</h3>
						<p class="feature-card__text">
							Seasonal ingredients, classic techniques, and
							inspired presentations define our ever-evolving
							offerings.
						</p>
					</div>

					<div class="feature-card">
						<svg
							class="feature-card__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
						</svg>
						<h3 class="feature-card__title">Personal Touches</h3>
						<p class="feature-card__text">
							Special occasions deserve special attention. Share
							your preferences, and we'll craft an experience to
							remember.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}
