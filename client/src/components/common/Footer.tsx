import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Footer() {
	const { loading } = useAuth();

	return (
		<footer>
			<div>
				<Show when={!loading()}>
					<div>
						<A href="/about">About</A>
						<A href="/contact">Contact</A>
						<A href="/menu">Menu</A>
						<A href="/gallery">Gallery</A>
					</div>
				</Show>
			</div>
		</footer>
	);
}
