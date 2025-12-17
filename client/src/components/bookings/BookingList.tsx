import { createSignal, onMount, For, Show } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";
import BookingCard from "./BookingCard";

interface Booking {
	booking_id: string;
	booking_date: string;
	party_size: number;
	table_number: number;
	special_instructions: string | null;
}

export default function BookingList() {
	const { setFlash } = useFlash();

	const [bookings, setBookings] = createSignal<Booking[]>([]);
	const [loading, setLoading] = createSignal(true);

	onMount(() => {
		loadBookings();
	});

	const loadBookings = async () => {
		setLoading(true);

		try {
			const response = await fetch("/api/book/list");

			if (!response.ok) {
				throw new Error("Failed to load bookings");
			}

			const data = await response.json();
			setBookings(data.bookings || []);
		} catch (error: any) {
			setFlash(error.message || "Failed to load bookings", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = (bookingId: string) => {
		setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
	};

	return (
		<div>
			<Show when={loading()}>
				<div class="loading">
					<div class="spinner"></div>
					<p>Loading reservations...</p>
				</div>
			</Show>

			<Show when={!loading()}>
				<Show
					when={bookings().length > 0}
					fallback={
						<div class="empty-state">
							<svg
								class="empty-state__icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<rect
									x="3"
									y="4"
									width="18"
									height="18"
									rx="2"
									ry="2"
								/>
								<line x1="16" y1="2" x2="16" y2="6" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="3" y1="10" x2="21" y2="10" />
							</svg>
							<h3 class="empty-state__title">
								No Reservations Yet
							</h3>
							<p class="empty-state__text">
								You haven't made any reservations. Book your
								first table to get started!
							</p>
						</div>
					}
				>
					<div class="booking-list">
						<For each={bookings()}>
							{(booking) => (
								<BookingCard
									booking={booking}
									onDelete={handleDelete}
								/>
							)}
						</For>
					</div>
				</Show>
			</Show>
		</div>
	);
}
