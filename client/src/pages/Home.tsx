import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
	const { user, loading } = useAuth();

	return (
		<div>
			<div>
				<h1>Welcome to Restaurant Booking</h1>
				<p>Reserve your table at our amazing restaurant</p>

				<Show when={!loading()}>
					<Show
						when={user()}
						fallback={
							<div>
								<A href="/register">Get Started</A>
								<A href="/login">Login</A>
							</div>
						}
					>
						<div>
							<A href="/book">Make a Booking</A>
							<A href="/bookings">View My Bookings</A>
						</div>
					</Show>
				</Show>
			</div>

			<div>
				<div>
					<h3>Easy Booking</h3>
					<p>Book your table in just a few clicks</p>
				</div>
				<div>
					<h3>Manage Reservations</h3>
					<p>View and manage all your bookings in one place</p>
				</div>
				<div>
					<h3>Special Requests</h3>
					<p>Add special instructions for your dining experience</p>
				</div>
			</div>
		</div>
	);
}
