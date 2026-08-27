import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  srcDir: "src",
  alias: {
    "@": resolve(__dirname, "src"),
  },
  manifest: {
    permissions: ["alarms", "tabs", "storage"],
  },
  imports: {
    dirs: ["lib"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
