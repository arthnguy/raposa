import ReactDOM from "react-dom/client";
//import TranslationOverlay from "@/entrypoints/content/components/TranslationOverlay";
import "@/assets/tailwind.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "translation-overlay",
      position: "overlay",
      onMount(container) {
        const root = ReactDOM.createRoot(container);
        //root.render(<TranslationOverlay onDismiss={() => ui.remove()} />);
      },
    });
    ui.mount();
    browser.runtime.onMessage.addListener(async (message) => {
      if (message === "show-overlay") {
      }
    });
  },
});
