import { Show } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";

export default function Flash() {
	const { flash, clearFlash } = useFlash();

	return (
		<Show when={flash()}>
			<div>
				<p>{flash()!.message}</p>
				<button onClick={clearFlash}>x</button>
			</div>
		</Show>
	);
}
