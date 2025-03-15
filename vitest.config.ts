import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from "vitest/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: "node"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./")
    }
  }
})
