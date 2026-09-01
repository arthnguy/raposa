import ReactDOM from "react-dom/client";
import ChallengeOverlay from "@/entrypoints/content/components/ChallengeOverlay";
import "@/assets/tailwind.css";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "ui",
	async main(ctx) {
		let ui: Awaited<ReturnType<typeof createShadowRootUi>> | null = null;
		let root: ReturnType<typeof ReactDOM.createRoot> | null = null;

		const showOverlay = async () => {
			if (ui) { // Duplicate render check
				return;
			}

			ui = await createShadowRootUi(ctx, {
				name: "translation-overlay",
				position: "overlay",
				anchor: "html",
				append: "last",
				css: `
					:host {
						all: initial !important;
						position: fixed !important;
						top: 0 !important;
						left: 0 !important;
						z-index: 2147483647 !important;
					}
				`,
				onMount(container) {
					root = ReactDOM.createRoot(container);
					root.render(
						<ChallengeOverlay
							onDismiss={async () => {
							try {
								ui?.remove();
							} finally {
								ui = null;
							}
							await browser.runtime.sendMessage("challenge-dismissed");
						}}
						/>
					);
				},
				onRemove() {
					root?.unmount();
					root = null;
				},
			});

			ui.mount();
		};

		browser.runtime.onMessage.addListener((message) => {
			if (message === "show-overlay") {
				showOverlay();
			}
		});
	},
});