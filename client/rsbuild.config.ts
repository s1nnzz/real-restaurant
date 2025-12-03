import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSolid } from "@rsbuild/plugin-solid";

export default defineConfig({
	plugins: [
		pluginBabel({
			include: /\.(?:jsx|tsx)$/,
		}),
		pluginSolid(),
	],
	html: {
		tags: [
			// Preconnect to Google Fonts for faster loading
			{
				tag: "link",
				attrs: {
					rel: "preconnect",
					href: "https://fonts.googleapis.com",
				},
			},
			{
				tag: "link",
				attrs: {
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossorigin: true,
				},
			},
			// Load fonts non-blocking with display=swap
			{
				tag: "link",
				attrs: {
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap",
				},
			},
		],
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:5000",
				changeOrigin: true,
			},
		},
	},
});
