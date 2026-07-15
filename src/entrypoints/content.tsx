import ReactDOM from "react-dom/client";
import TranslationOverlay from "@/components/TranslationOverlay";
import "@/assets/tailwind.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  main(ctx) {
    browser.runtime.onMessage.addListener(async (message) => {
      if (message === "show-overlay") {
        const ui = await createShadowRootUi(ctx, {
          name: "translation-overlay",
          position: "overlay",
          onMount(container) {
            const root = ReactDOM.createRoot(container);
            root.render(<TranslationOverlay />);
          },
        });
        ui.mount();
      }
    });
  },
});
