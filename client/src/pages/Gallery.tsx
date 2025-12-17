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
		<div class="gallery-page">
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">Gallery</h1>
					<p class="page-header__subtitle">
						A glimpse into our world
					</p>
				</div>
			</div>

			<div class="container">
				<Show when={loading()}>
					<div class="loading">
						<div class="spinner"></div>
						<p>Loading gallery...</p>
					</div>
				</Show>

				<Show when={!loading() && files().length === 0}>
					<div class="empty-state">
						<svg
							class="empty-state__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
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
						<h3 class="empty-state__title">No Images Yet</h3>
						<p class="empty-state__text">
							Our gallery is being curated. Check back soon!
						</p>
					</div>
				</Show>

				<Show when={!loading() && files().length > 0}>
					<div class="gallery-grid">
						<For each={files()}>
							{(file) => (
								<div
									class="gallery-item"
									onClick={() => openLightbox(file)}
								>
									<img
										src={`/api/uploads/${file}`}
										alt={file}
										loading="lazy"
									/>
									<div class="gallery-item__overlay">
										<span>{file}</span>
									</div>
								</div>
							)}
						</For>
					</div>
				</Show>
			</div>

			{/* Lightbox */}
			<Show when={selectedImage()}>
				<div class="lightbox" onClick={closeLightbox}>
					<button
						class="lightbox__close"
						onClick={closeLightbox}
						aria-label="Close"
					>
						×
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
