import { createSignal, onMount, Show, For } from "solid-js";
import { useFlash } from "../contexts/FlashContext";
import { useNavigate } from "@solidjs/router";

interface User {
	id: number;
	email: string;
	role: "user" | "admin";
}

interface Booking {
	booking_id: string;
	booking_date: string;
	party_size: number;
	table_number: number;
	special_instructions: string | null;
	user_id: number;
}

export default function Admin() {
	const [activeTab, setActiveTab] = createSignal<
		"users" | "bookings" | "images"
	>("users");
	const [users, setUsers] = createSignal<User[]>([]);
	const [bookings, setBookings] = createSignal<Booking[]>([]);
	const [images, setImages] = createSignal<string[]>([]);
	const [previewImage, setPreviewImage] = createSignal<string | null>(null);
	const [loading, setLoading] = createSignal(false);
	const { setFlash } = useFlash();
	const navigate = useNavigate();

	onMount(() => {
		fetchUsers();
		fetchBookings();
		fetchImages();
	});

	async function fetchUsers() {
		setLoading(true);
		try {
			const response = await fetch("/api/admin/users");
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}
			const data = await response.json();
			setUsers(data.users);
		} catch (error) {
			setFlash((error as Error).message, "error");
		} finally {
			setLoading(false);
		}
	}

	async function fetchBookings() {
		setLoading(true);
		try {
			const response = await fetch("/api/admin/bookings");
			if (!response.ok) {
				throw new Error("Failed to fetch bookings");
			}
			const data = await response.json();
			setBookings(data.bookings);
		} catch (error) {
			setFlash((error as Error).message, "error");
		} finally {
			setLoading(false);
		}
	}

	async function deleteUser(userId: number, email: string) {
		if (!confirm(`Are you sure you want to delete user ${email}?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Failed to delete user");
			}

			setFlash("User deleted successfully", "success");
			setUsers(users().filter((u) => u.id !== userId));
		} catch (error) {
			setFlash((error as Error).message, "error");
		}
	}

	async function deleteBooking(bookingId: string) {
		if (!confirm(`Are you sure you want to delete booking ${bookingId}?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/bookings/${bookingId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Failed to delete booking");
			}

			setFlash("Booking deleted successfully", "success");
			setBookings(bookings().filter((b) => b.booking_id !== bookingId));
		} catch (error) {
			setFlash((error as Error).message, "error");
		}
	}

	async function fetchImages() {
		try {
			const response = await fetch("/api/files/list");
			if (!response.ok) {
				throw new Error("Failed to fetch images");
			}
			const data = await response.json();
			// Filter to only show image files
			const imageFiles = data.filter((file: string) =>
				/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
			);
			setImages(imageFiles);
		} catch (error) {
			setFlash((error as Error).message, "error");
		}
	}

	async function deleteImage(filename: string) {
		if (!confirm(`Are you sure you want to delete ${filename}?`)) {
			return;
		}

		try {
			const response = await fetch(
				`/api/files/${encodeURIComponent(filename)}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Failed to delete image");
			}

			setFlash("Image deleted successfully", "success");
			setImages(images().filter((img) => img !== filename));
			if (previewImage() === filename) {
				setPreviewImage(null);
			}
		} catch (error) {
			setFlash((error as Error).message, "error");
		}
	}

	return (
		<div class="admin-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">Admin Dashboard</h1>
					<p class="page-header__subtitle">
						Manage users, bookings, and content
					</p>
				</div>
			</div>

			<div class="container">
				<div class="admin-tabs">
					<button
						class={`admin-tab ${
							activeTab() === "users" ? "admin-tab--active" : ""
						}`}
						onClick={() => setActiveTab("users")}
					>
						Users ({users().length})
					</button>
					<button
						class={`admin-tab ${
							activeTab() === "bookings"
								? "admin-tab--active"
								: ""
						}`}
						onClick={() => setActiveTab("bookings")}
					>
						Bookings ({bookings().length})
					</button>
					<button
						class={`admin-tab ${
							activeTab() === "images" ? "admin-tab--active" : ""
						}`}
						onClick={() => setActiveTab("images")}
					>
						Images ({images().length})
					</button>
					<button
						class="admin-tab"
						onClick={() => navigate("/upload")}
					>
						+ Upload File
					</button>
				</div>

				<Show when={activeTab() === "users"}>
					<div class="admin-section">
						<h2 class="admin-section__title">User Management</h2>
						<Show
							when={!loading()}
							fallback={
								<div class="loading">
									<div class="spinner"></div>
									<p>Loading users...</p>
								</div>
							}
						>
							<Show
								when={users().length > 0}
								fallback={
									<p class="text-muted">No users found.</p>
								}
							>
								<table class="admin-table">
									<thead>
										<tr>
											<th>ID</th>
											<th>Email</th>
											<th>Role</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										<For each={users()}>
											{(user) => (
												<tr>
													<td>{user.id}</td>
													<td>{user.email}</td>
													<td>
														<span
															class={`status ${
																user.role ===
																"admin"
																	? "status--info"
																	: "status--success"
															}`}
														>
															{user.role}
														</span>
													</td>
													<td class="admin-table__actions">
														<button
															class="btn btn--outline btn--small"
															onClick={() =>
																deleteUser(
																	user.id,
																	user.email
																)
															}
														>
															Delete
														</button>
													</td>
												</tr>
											)}
										</For>
									</tbody>
								</table>
							</Show>
						</Show>
					</div>
				</Show>

				<Show when={activeTab() === "bookings"}>
					<div class="admin-section">
						<h2 class="admin-section__title">Booking Management</h2>
						<Show
							when={!loading()}
							fallback={
								<div class="loading">
									<div class="spinner"></div>
									<p>Loading bookings...</p>
								</div>
							}
						>
							<Show
								when={bookings().length > 0}
								fallback={
									<p class="text-muted">No bookings found.</p>
								}
							>
								<table class="admin-table">
									<thead>
										<tr>
											<th>Booking ID</th>
											<th>Date</th>
											<th>Table</th>
											<th>Party Size</th>
											<th>User ID</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										<For each={bookings()}>
											{(booking) => (
												<tr>
													<td>
														{booking.booking_id}
													</td>
													<td>
														{new Date(
															booking.booking_date
														).toLocaleString()}
													</td>
													<td>
														Table{" "}
														{booking.table_number}
													</td>
													<td>
														{booking.party_size}{" "}
														guests
													</td>
													<td>#{booking.user_id}</td>
													<td class="admin-table__actions">
														<button
															class="btn btn--outline btn--small"
															onClick={() =>
																deleteBooking(
																	booking.booking_id
																)
															}
														>
															Delete
														</button>
													</td>
												</tr>
											)}
										</For>
									</tbody>
								</table>
							</Show>
						</Show>
					</div>
				</Show>

				<Show when={activeTab() === "images"}>
					<div class="admin-section">
						<h2 class="admin-section__title">Image Management</h2>
						<Show
							when={images().length > 0}
							fallback={
								<p class="text-muted">
									No images uploaded yet.
								</p>
							}
						>
							<div class="admin-images">
								<For each={images()}>
									{(image) => (
										<div class="admin-image">
											<img
												src={`/api/uploads/${image}`}
												alt={image}
												loading="lazy"
											/>
											<div class="admin-image__overlay">
												<button
													class="admin-image__btn"
													onClick={() =>
														setPreviewImage(image)
													}
													aria-label="Preview"
												>
													👁
												</button>
												<button
													class="admin-image__btn admin-image__btn--delete"
													onClick={() =>
														deleteImage(image)
													}
													aria-label="Delete"
												>
													×
												</button>
											</div>
										</div>
									)}
								</For>
							</div>
						</Show>

						<Show when={previewImage()}>
							<div
								class="lightbox"
								onClick={() => setPreviewImage(null)}
							>
								<button
									class="lightbox__close"
									onClick={() => setPreviewImage(null)}
									aria-label="Close"
								>
									×
								</button>
								<img
									src={`/api/uploads/${previewImage()}`}
									alt={previewImage()!}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
						</Show>
					</div>
				</Show>
			</div>
		</div>
	);
}
