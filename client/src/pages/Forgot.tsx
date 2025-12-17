import { createSignal } from "solid-js";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function ForgotPassword() {
	const { setFlash } = useFlash();

	const [email, setEmail] = createSignal("");
	const [loading, setLoading] = createSignal(false);
	const [resetToken, setResetToken] = createSignal<string | null>(null);

	const handleSubmit = async () => {
		setLoading(true);

		try {
			const response = await fetch("/api/forgot", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email() }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Request failed");
			}

			if (data.devToken) {
				setResetToken(data.devToken);
				setFlash("Reset token genetared:", "success");
			} else {
				setFlash(data.message, "success");
			}
		} catch (error: any) {
			setFlash(error.message || "Request failed", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div class="auth-page">
			<div class="auth-card">
				<h1 class="auth-card__title">Forgot Password</h1>
				<p class="auth-card__subtitle">
					Enter your email to receive a password reset link.
				</p>

				<Form onSubmit={handleSubmit}>
					<div class="form-group">
						<label class="form-label" for="email">
							Email
						</label>
						<input
							class="form-input"
							type="email"
							id="email"
							value={email()}
							onInput={(e) => setEmail(e.currentTarget.value)}
							required
							disabled={loading()}
						/>
					</div>

					<button
						class="btn btn--primary btn--full"
						type="submit"
						disabled={loading()}
					>
						{loading() ? "Sending..." : "Send Reset Link"}
					</button>
				</Form>

				{resetToken() && (
					<div class="dev-token">
						<h3>Development Mode - Reset Token:</h3>
						<code class="dev-token__code">{resetToken()}</code>
						<p>
							<a
								class="link"
								href={`/reset-password?token=${resetToken()}`}
							>
								Click here to reset password
							</a>
						</p>
					</div>
				)}

				<p class="auth-card__link">
					<a class="link" href="/login">
						Back to login
					</a>
				</p>
			</div>
		</div>
	);
}
