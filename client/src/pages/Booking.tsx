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
		<div class="booking-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">
						{view() === "create"
							? "Reserve a Table"
							: "Your Reservations"}
					</h1>
					<p class="page-header__subtitle">
						{view() === "create"
							? "Select your preferred date and time"
							: "Manage your upcoming visits"}
					</p>
				</div>
			</div>

			<div class="container">
				<div class="booking-header">
					<div class="booking-tabs">
						<button
							class={`booking-tab ${
								view() === "list" ? "booking-tab--active" : ""
							}`}
							onClick={() => {
								setView("list");
								navigate("/bookings");
							}}
						>
							My Reservations
						</button>
						<button
							class={`booking-tab ${
								view() === "create" ? "booking-tab--active" : ""
							}`}
							onClick={() => {
								setView("create");
								navigate("/book");
							}}
						>
							New Reservation
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
