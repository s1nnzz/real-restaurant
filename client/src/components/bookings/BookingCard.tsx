import { createSignal } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";

interface BookingCardProps {
	booking: {
		booking_id: string;
		booking_date: string;
		party_size: number;
		table_number: number;
		special_instructions: string | null;
	};
	onDelete: (bookingId: string) => void;
}

export default function BookingCard(props: BookingCardProps) {
	const { setFlash } = useFlash();
	const [deleting, setDeleting] = createSignal(false);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return {
			day: date.getDate(),
			month: date.toLocaleString("en-US", { month: "short" }),
			time: date.toLocaleString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this booking?")) {
			return;
		}

		setDeleting(true);

		try {
			const response = await fetch(
				`/api/book/delete/${props.booking.booking_id}`,
				{
					method: "DELETE",
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to delete booking");
			}

			setFlash("Booking deleted successfully", "success");
			props.onDelete(props.booking.booking_id);
		} catch (error: any) {
			setFlash(error.message || "Failed to delete booking", "error");
		} finally {
			setDeleting(false);
		}
	};

	return (
		<article class="booking-card">
			<div class="booking-card__date">
				<span class="booking-card__day">
					{formatDate(props.booking.booking_date).day}
				</span>
				<span class="booking-card__month">
					{formatDate(props.booking.booking_date).month}
				</span>
			</div>
			<div class="booking-card__info">
				<span class="booking-card__time">
					{formatDate(props.booking.booking_date).time}
				</span>
				<span class="booking-card__details">
					{props.booking.party_size}{" "}
					{props.booking.party_size === 1 ? "guest" : "guests"} ·
					Table {props.booking.table_number}
				</span>
				{props.booking.special_instructions && (
					<span class="booking-card__details text-muted">
						"{props.booking.special_instructions}"
					</span>
				)}
			</div>
			<div class="booking-card__actions">
				<button
					class="btn btn--outline btn--small"
					onClick={handleDelete}
					disabled={deleting()}
				>
					{deleting() ? "Cancelling..." : "Cancel"}
				</button>
			</div>
		</article>
	);
}
