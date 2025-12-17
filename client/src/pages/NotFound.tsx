import { A } from "@solidjs/router";

export default function NotFound() {
	return (
		<div class="status-page">
			<div class="status-card">
				<div class="status-card__icon">404</div>
				<h1 class="status-card__title">Page Not Found</h1>
				<p class="status-card__text">
					Oops! The page you're looking for doesn't exist.
				</p>
				<div class="status-card__actions">
					<A href="/" class="btn btn--primary">
						Go Home
					</A>
					<A href="/menu" class="btn btn--secondary">
						Browse Menu
					</A>
				</div>
			</div>
		</div>
	);
}
