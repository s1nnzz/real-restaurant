import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Footer() {
	const { loading } = useAuth();

	return (
		<footer class="footer">
			<div class="footer-container">
				<Show when={!loading()}>
					<div class="footer-links">
						<A href="/about" class="footer-link">
							About
						</A>
						<A href="/contact" class="footer-link">
							Contact
						</A>
						<A href="/menu" class="footer-link">
							Menu
						</A>
						<A href="/gallery" class="footer-link">
							Gallery
						</A>
					</div>
				</Show>
			</div>
		</footer>
	);
}
