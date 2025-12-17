import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";

export default function Delete() {
	const navigate = useNavigate();
	const { deleteAccount, user } = useAuth();
	const { setFlash } = useFlash();

	const [confirmText, setConfirmText] = createSignal("");
	const [loading, setLoading] = createSignal(false);

	const handleDelete = async () => {
		if (confirmText() !== "DELETE") {
			setFlash("Please type DELETE to confirm", "error");
			return;
		}

		setLoading(true);

		try {
			await deleteAccount();
			setFlash("Account deleted successfully", "success");
			navigate("/");
		} catch (error: any) {
			setFlash(error.message || "Failed to delete account", "error");
		} finally {
			setLoading(false);
		}
	};

	if (!user()) {
		navigate("/login");
		return null;
	}

	return (
		<div class="auth-page">
			<div class="auth-card">
				<h1 class="auth-card__title">Delete Account</h1>
				<div class="alert alert--warning mb-lg">
					<strong>⚠️ Warning</strong>
					<p>
						This action is permanent and cannot be undone. All your
						data, including bookings, will be deleted.
					</p>
				</div>

				<div class="form-group">
					<label class="form-label" for="confirm">
						Type DELETE to confirm:
					</label>
					<input
						class="form-input"
						type="text"
						id="confirm"
						value={confirmText()}
						onInput={(e) => setConfirmText(e.currentTarget.value)}
						disabled={loading()}
						placeholder="DELETE"
					/>
				</div>

				<div class="auth-card__actions">
					<button
						class="btn btn--danger"
						type="button"
						onClick={handleDelete}
						disabled={loading() || confirmText() !== "DELETE"}
					>
						{loading() ? "Deleting..." : "Delete Account"}
					</button>
					<button
						class="btn btn--secondary"
						type="button"
						onClick={() => navigate("/profile")}
						disabled={loading()}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
