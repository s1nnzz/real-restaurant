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
		<div>
			<div>
				<h1>Our Menu</h1>
				<button onClick={openPanel}>
					🛒
					<Show when={itemCount() > 0}>
						<span>{itemCount()}</span>
					</Show>
				</button>
			</div>

			<Show when={!menuItems.loading} fallback={<p>Loading menu...</p>}>
				<Show when={menuItems()} fallback={<p>Failed to load menu</p>}>
					<div>
						<button onClick={() => setSelectedCategory(null)}>
							All
						</button>
						<For each={categories()}>
							{(category) => (
								<button
									onClick={() =>
										setSelectedCategory(category)
									}
								>
									{category}
								</button>
							)}
						</For>
					</div>

					<div>
						<For each={filteredItems()}>
							{(item) => (
								<div>
									<Show when={item.image_url}>
										<img
											src={item.image_url!}
											alt={item.name}
										/>
									</Show>
									<div>
										<h3>{item.name}</h3>
										<p>{item.category}</p>
										<Show when={item.description}>
											<p>{item.description}</p>
										</Show>
										<p>£{Number(item.price).toFixed(2)}</p>
										<button
											onClick={() => addToCart(item.id)}
											disabled={
												addingToCart() === item.id
											}
										>
											{addingToCart() === item.id
												? "Adding..."
												: "Add to Cart"}
										</button>
									</div>
								</div>
							)}
						</For>
					</div>
				</Show>
			</Show>

			{/* Cart Side Panel */}
			<CartSidePanel />
		</div>
	);
}
