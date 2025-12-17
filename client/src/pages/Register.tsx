import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Register() {
	const navigate = useNavigate();
	const { register } = useAuth();
	const { setFlash } = useFlash();

	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [confirmPassword, setConfirmPassword] = createSignal("");
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = async () => {
		if (password() !== confirmPassword()) {
			return setFlash("Passwords do not match:", "error");
		}

		if (password().length < 8) {
			return setFlash("Password must be at least 8 characters", "error");
		}

		setLoading(true);

		try {
			await register(email(), password());
			setFlash("Registration successful!", "success");
			navigate("/");
		} catch (error: any) {
			setFlash(error.message || "Registration failed", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div class="auth-page">
			<div class="auth-card">
				<h1 class="auth-card__title">Create an Account</h1>

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
							placeholder="your@email.com"
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="password">
							Password
						</label>
						<input
							class="form-input"
							type="password"
							id="password"
							value={password()}
							onInput={(e) => setPassword(e.currentTarget.value)}
							required
							disabled={loading()}
							minLength={8}
							placeholder="Min. 8 characters"
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="confirm-password">
							Confirm Password
						</label>
						<input
							class="form-input"
							type="password"
							id="confirm-password"
							value={confirmPassword()}
							onInput={(e) =>
								setConfirmPassword(e.currentTarget.value)
							}
							required
							disabled={loading()}
							minLength={8}
							placeholder="••••••••"
						/>
					</div>

					<div class="form-footer">
						<button
							class="btn btn--primary btn--full"
							type="submit"
							disabled={loading()}
						>
							{loading()
								? "Creating account..."
								: "Create Account"}
						</button>

						<p>
							Already have an account?{" "}
							<a href="/login">Sign in</a>
						</p>
					</div>
				</Form>
			</div>
		</div>
	);
}
