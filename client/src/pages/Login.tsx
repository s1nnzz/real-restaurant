import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const { setFlash } = useFlash();

	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = async () => {
		setLoading(true);

		try {
			await login(email(), password());
			setFlash("Login successful!", "success");
			navigate("/");
		} catch (error: any) {
			setFlash(error.message || "Login failed", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div class="auth-page">
			<div class="auth-card">
				<h1 class="auth-card__title">Welcome Back</h1>

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
							placeholder="••••••••"
						/>
					</div>

					<div class="form-footer">
						<button
							class="btn btn--primary btn--full"
							type="submit"
							disabled={loading()}
						>
							{loading() ? "Signing in..." : "Sign In"}
						</button>

						<p>
							Don't have an account?{" "}
							<a href="/register">Create one</a>
						</p>
						<p>
							<a href="/forgot">Forgot your password?</a>
						</p>
					</div>
				</Form>
			</div>
		</div>
	);
}
