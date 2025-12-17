import { createSignal } from "solid-js";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Contact() {
	const { setFlash } = useFlash();

	const [name, setName] = createSignal("");
	const [email, setEmail] = createSignal("");
	const [message, setMessage] = createSignal("");
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = async () => {
		if (!name() || !email() || !message()) {
			setFlash("Please fill in all fields", "error");
			return;
		}

		setLoading(true);

		// Simulate sending a message
		setTimeout(() => {
			setFlash("Message sent! We'll get back to you soon.", "success");
			setName("");
			setEmail("");
			setMessage("");
			setLoading(false);
		}, 1000);
	};

	return (
		<div class="contact-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">Get in Touch</h1>
					<p class="page-header__subtitle">
						We'd love to hear from you
					</p>
				</div>
			</div>

			<div class="container">
				<div class="contact-grid">
					<div class="contact-form">
						<Form onSubmit={handleSubmit}>
							<div class="form-group">
								<label class="form-label" for="name">
									Name
								</label>
								<input
									class="form-input"
									type="text"
									id="name"
									value={name()}
									onInput={(e) =>
										setName(e.currentTarget.value)
									}
									required
									disabled={loading()}
									placeholder="Your name"
								/>
							</div>

							<div class="form-group">
								<label class="form-label" for="email">
									Email
								</label>
								<input
									class="form-input"
									type="email"
									id="email"
									value={email()}
									onInput={(e) =>
										setEmail(e.currentTarget.value)
									}
									required
									disabled={loading()}
									placeholder="your@email.com"
								/>
							</div>

							<div class="form-group">
								<label class="form-label" for="message">
									Message
								</label>
								<textarea
									class="form-textarea"
									id="message"
									value={message()}
									onInput={(e) =>
										setMessage(e.currentTarget.value)
									}
									required
									disabled={loading()}
									rows="5"
									placeholder="How can we help you?"
								/>
							</div>

							<button
								class="btn btn--primary btn--full"
								type="submit"
								disabled={loading()}
							>
								{loading() ? "Sending..." : "Send Message"}
							</button>
						</Form>
					</div>

					<div class="contact-info">
						<h3>Other Ways to Reach Us</h3>

						<div class="contact-info__item">
							<svg
								class="contact-info__icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
								<polyline points="22,6 12,13 2,6" />
							</svg>
							<div>
								<strong>Email</strong>
								<br />
								reservations@lamaisonbleue.com
							</div>
						</div>

						<div class="contact-info__item">
							<svg
								class="contact-info__icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
							</svg>
							<div>
								<strong>Phone</strong>
								<br />
								+44 20 7946 0958
							</div>
						</div>

						<div class="contact-info__item">
							<svg
								class="contact-info__icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
								<circle cx="12" cy="10" r="3" />
							</svg>
							<div>
								<strong>Address</strong>
								<br />
								42 Mayfair Lane
								<br />
								London W1K 2PB
								<br />
								United Kingdom
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
