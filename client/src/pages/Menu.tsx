import { createSignal, createResource, For, Show } from "solid-js";
import { useFlash } from "../contexts/FlashContext";
import { useCart } from "../contexts/CartContext";
import CartSidePanel from "../components/cart/CartSidePanel";

interface MenuItem {
	id: number;
	name: string;
	description: string | null;
	price: number;
	category: string;
	image_url: string | null;
}

async function fetchMenuItems(): Promise<MenuItem[]> {
	const res = await fetch("/api/menu");
	if (!res.ok) throw new Error("Failed to fetch menu");
	const data = await res.json();
	return data.items;
}

async function fetchCategories(): Promise<string[]> {
	const res = await fetch("/api/menu/categories");
	if (!res.ok) throw new Error("Failed to fetch categories");
	const data = await res.json();
	return data.categories;
}

export default function Menu() {
	const { setFlash } = useFlash();
	const { addItem, itemCount, openPanel, refetchDetails } = useCart();
	const [selectedCategory, setSelectedCategory] = createSignal<string | null>(
		null
	);
	const [addingToCart, setAddingToCart] = createSignal<number | null>(null);

	const [menuItems] = createResource(fetchMenuItems);
	const [categories] = createResource(fetchCategories);

	const filteredItems = () => {
		const items = menuItems();
		if (!items) return [];
		const category = selectedCategory();
		if (!category) return items;
		return items.filter((item) => item.category === category);
	};

	const addToCart = (menuItemId: number) => {
		setAddingToCart(menuItemId);

		// Add to localStorage cart via context
		addItem(menuItemId, 1);
		refetchDetails();
		setFlash("Item added to cart", "success");

		// Brief visual feedback
		setTimeout(() => {
			setAddingToCart(null);
		}, 300);
	};

	return (
		<div class="menu-page">
			{/* Page Header */}
			<div class="page-header">
				<div class="page-header__content">
					<h1 class="page-header__title">Our Menu</h1>
					<p class="page-header__subtitle">
						Seasonal dishes crafted with care
					</p>
				</div>
			</div>

			<div class="container">
				<div class="menu-header">
					<div class="menu-header__title">
						<h2>À La Carte</h2>
					</div>
					<button class="cart-btn" onClick={openPanel}>
						🛒
						<Show when={itemCount() > 0}>
							<span class="cart-btn__count">{itemCount()}</span>
						</Show>
					</button>
				</div>

				<Show
					when={!menuItems.loading}
					fallback={
						<div class="loading">
							<div class="spinner"></div>
							<p>Loading menu...</p>
						</div>
					}
				>
					<Show
						when={menuItems()}
						fallback={
							<p class="text-center text-muted">
								Failed to load menu
							</p>
						}
					>
						<div class="menu-filters">
							<button
								class={`menu-filter ${
									selectedCategory() === null
										? "menu-filter--active"
										: ""
								}`}
								onClick={() => setSelectedCategory(null)}
							>
								All
							</button>
							<For each={categories()}>
								{(category) => (
									<button
										class={`menu-filter ${
											selectedCategory() === category
												? "menu-filter--active"
												: ""
										}`}
										onClick={() =>
											setSelectedCategory(category)
										}
									>
										{category}
									</button>
								)}
							</For>
						</div>

						<div class="menu-grid">
							<For each={filteredItems()}>
								{(item) => (
									<article class="card">
										<Show when={item.image_url}>
											<img
												class="card__image"
												src={item.image_url!}
												alt={item.name}
												loading="lazy"
											/>
										</Show>
										<div class="card__body">
											<span class="card__category">
												{item.category}
											</span>
											<h3 class="card__title">
												{item.name}
											</h3>
											<Show when={item.description}>
												<p class="card__description">
													{item.description}
												</p>
											</Show>
											<div class="card__footer">
												<span class="card__price">
													£
													{Number(item.price).toFixed(
														2
													)}
												</span>
												<button
													class="btn btn--primary btn--small"
													onClick={() =>
														addToCart(item.id)
													}
													disabled={
														addingToCart() ===
														item.id
													}
												>
													{addingToCart() === item.id
														? "Adding..."
														: "Add to Cart"}
												</button>
											</div>
										</div>
									</article>
								)}
							</For>
						</div>
					</Show>
				</Show>
			</div>

			{/* Cart Side Panel */}
			<CartSidePanel />
		</div>
	);
}
