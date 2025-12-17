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
		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
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
		<div>
			<div>
				<h3>Booking #{props.booking.booking_id}</h3>
				<span>{formatDate(props.booking.booking_date)}</span>
			</div>
			<div>
				<div>
					<span>Party Size:</span>
					<span>{props.booking.party_size} people</span>
				</div>
				<div>
					<span>Table:</span>
					<span>Table {props.booking.table_number}</span>
				</div>
				{props.booking.special_instructions && (
					<div>
						<span>Special Instructions:</span>
						<span>{props.booking.special_instructions}</span>
					</div>
				)}
			</div>
			<button onClick={handleDelete} disabled={deleting()}>
				{deleting() ? "Deleting..." : "Delete Booking"}
			</button>
		</div>
	);
}
