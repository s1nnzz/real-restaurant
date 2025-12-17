import { Show } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";

export default function Flash() {
	const { flash, clearFlash } = useFlash();

	return (
		<Show when={flash()}>
			<div class={`flash flash--${flash()!.type}`} role="alert">
				<p class="flash__message">{flash()!.message}</p>
				<button
					class="flash__close"
					onClick={clearFlash}
					aria-label="Dismiss"
				>
					×
				</button>
			</div>
		</Show>
	);
}
