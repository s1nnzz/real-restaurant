import { createSignal, onMount, For, Show } from "solid-js";

export default function Gallery() {
	const [files, setFiles] = createSignal<string[]>([]);
	const [loading, setLoading] = createSignal(true);
	const [selectedImage, setSelectedImage] = createSignal<string | null>(null);

	onMount(async () => {
		try {
			const res = await fetch("/api/files/list");
			if (res.ok) {
				const allFiles = await res.json();
				// Filter to only show image files
				const imageFiles = allFiles.filter((file: string) =>
					/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
				);
				setFiles(imageFiles);
			}
		} catch (error) {
			console.error("Failed to fetch files:", error);
		} finally {
			setLoading(false);
		}
	});

	function openLightbox(file: string) {
		setSelectedImage(file);
	}

	function closeLightbox() {
		setSelectedImage(null);
	}

	return (
		<div>
			<div>
				<h1>Gallery</h1>
				<p>Browse our collection of images</p>
			</div>

			<Show when={loading()}>
				<div>
					<p>Loading images...</p>
				</div>
			</Show>

			<Show when={!loading() && files().length === 0}>
				<div>
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect
								x="3"
								y="3"
								width="18"
								height="18"
								rx="2"
								ry="2"
							/>
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21 15 16 10 5 21" />
						</svg>
					</div>
					<p>No images uploaded yet</p>
				</div>
			</Show>

			<Show when={!loading() && files().length > 0}>
				<div>
					<For each={files()}>
						{(file) => (
							<div onClick={() => openLightbox(file)}>
								<img
									src={`/api/uploads/${file}`}
									alt={file}
									loading="lazy"
								/>
								<div>
									<span>{file}</span>
								</div>
							</div>
						)}
					</For>
				</div>
			</Show>

			{/* Lightbox */}
			<Show when={selectedImage()}>
				<div onClick={closeLightbox}>
					<button onClick={closeLightbox}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
					<img
						src={`/api/uploads/${selectedImage()}`}
						alt={selectedImage() || ""}
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			</Show>
		</div>
	);
}
