import { createSignal, onMount, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import BookingForm from "../components/bookings/BookingForm";
import BookingList from "../components/bookings/BookingList";

export default function Booking() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, loading } = useAuth();

	const [view, setView] = createSignal<"list" | "create">("list");

	onMount(() => {
		if (location.pathname === "/book") {
			setView("create");
		} else {
			setView("list");
		}
	});

	if (!loading() && !user()) {
		navigate("/login");
		return null;
	}

	return (
		<div>
			<div>
				<div>
					<h1>
						{view() === "create" ? "Make a Booking" : "My Bookings"}
					</h1>
					<div>
						<button
							onClick={() => {
								setView("list");
								navigate("/bookings");
							}}
						>
							My Bookings
						</button>
						<button
							onClick={() => {
								setView("create");
								navigate("/book");
							}}
						>
							New Booking
						</button>
					</div>
				</div>

				<Show when={!loading()}>
					<Show when={view() === "create"} fallback={<BookingList />}>
						<BookingForm />
					</Show>
				</Show>
			</div>
		</div>
	);
}
