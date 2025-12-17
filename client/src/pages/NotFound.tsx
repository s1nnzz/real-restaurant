import { A } from "@solidjs/router";

export default function NotFound() {
	return (
		<div>
			<div>
				<h1>404 - Page Not Found</h1>
				<p>Oops! The page you're looking for doesn't exist.</p>
				<A href="/">Go Home</A>
			</div>
		</div>
	);
}
