import { Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
	const { user, loading, isAdmin } = useAuth();
	const [menuOpen, setMenuOpen] = createSignal(false);

	const toggleMenu = () => setMenuOpen(!menuOpen());
	const closeMenu = () => setMenuOpen(false);

	return (
		<nav class="nav">
			<div class="nav__container">
				<A href="/" class="nav__logo" onClick={closeMenu}>
					La Maison Bleue
				</A>

				<button
					class="nav__toggle"
					onClick={toggleMenu}
					aria-label="Toggle navigation"
				>
					<span></span>
					<span></span>
					<span></span>
				</button>

				<Show when={!loading()}>
					<div
						class={`nav__links ${
							menuOpen() ? "nav__links--open" : ""
						}`}
					>
						<Show
							when={user()}
							fallback={
								<>
									<A
										href="/about"
										class="nav__link"
										onClick={closeMenu}
									>
										About
									</A>
									<A
										href="/contact"
										class="nav__link"
										onClick={closeMenu}
									>
										Contact
									</A>
									<A
										href="/login"
										class="nav__link"
										onClick={closeMenu}
									>
										Login
									</A>
									<A
										href="/register"
										class="nav__link nav__link--accent"
										onClick={closeMenu}
									>
										Register
									</A>
								</>
							}
						>
							<A
								href="/gallery"
								class="nav__link"
								onClick={closeMenu}
							>
								Gallery
							</A>
							<Show when={!isAdmin()}>
								<A
									href="/menu"
									class="nav__link"
									onClick={closeMenu}
								>
									Menu
								</A>
								<A
									href="/cart"
									class="nav__link"
									onClick={closeMenu}
								>
									Cart
								</A>
								<A
									href="/orders"
									class="nav__link"
									onClick={closeMenu}
								>
									Orders
								</A>
								<A
									href="/rewards"
									class="nav__link"
									onClick={closeMenu}
								>
									Rewards
								</A>
								<A
									href="/book"
									class="nav__link"
									onClick={closeMenu}
								>
									Book a Table
								</A>
								<A
									href="/profile"
									class="nav__link"
									onClick={closeMenu}
								>
									Profile
								</A>
							</Show>
							<Show when={isAdmin()}>
								<A
									href="/admin"
									class="nav__link"
									onClick={closeMenu}
								>
									Admin
								</A>
							</Show>

							<A
								href="/logout"
								class="nav__link nav__link--accent"
								onClick={closeMenu}
							>
								Logout
							</A>
						</Show>
					</div>
				</Show>
			</div>
		</nav>
	);
}
