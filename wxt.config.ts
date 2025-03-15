import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["tabs"],
    icons: {
      16: "icon/trunk-16.png",
      24: "icon/trunk-24.png",
      48: "icon/trunk-48.png",
      96: "icon/trunk-96.png",
      128: "icon/trunk-128.png"
    }
  },
  vite: () => ({
    plugins: [tailwindcss()],
    modules: ["@wxt-dev/module-react"]
  })
})
