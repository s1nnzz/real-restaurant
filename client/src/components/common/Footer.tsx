import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Footer() {
	const { loading } = useAuth();

	return (
		<footer class="footer">
			<div class="footer__container">
				<div>
					<div class="footer__brand">La Maison Bleue</div>
					<p class="footer__tagline">
						Experience refined European cuisine in an atmosphere of
						understated elegance.
					</p>
				</div>

				<Show when={!loading()}>
					<div>
						<h4 class="footer__title">Explore</h4>
						<div class="footer__links">
							<A href="/menu" class="footer__link">
								Our Menu
							</A>
							<A href="/gallery" class="footer__link">
								Gallery
							</A>
							<A href="/book" class="footer__link">
								Reservations
							</A>
						</div>
					</div>

					<div>
						<h4 class="footer__title">Information</h4>
						<div class="footer__links">
							<A href="/about" class="footer__link">
								About Us
							</A>
							<A href="/contact" class="footer__link">
								Contact
							</A>
						</div>
					</div>

					<div>
						<h4 class="footer__title">Hours</h4>
						<div class="footer__links">
							<span class="footer__link">
								Mon–Thu: 12pm – 10pm
							</span>
							<span class="footer__link">
								Fri–Sat: 12pm – 11pm
							</span>
							<span class="footer__link">Sun: 12pm – 9pm</span>
						</div>
					</div>
				</Show>

				<div class="footer__bottom">
					<p>
						&copy; {new Date().getFullYear()} La Maison Bleue. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
