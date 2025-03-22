import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "wxt"

import { GithubIssuesProvider } from "./lib/providers/github-issues-provider"
import { TrelloProvider } from "./lib/providers/trello-provider"

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    browser_specific_settings: {
      gecko: {
        id: "arborously@codery-royale.com"
      }
    },
    permissions: ["tabs", "storage"],
    icons: {
      16: "icon/trunk-arborously-16.png",
      24: "icon/trunk-arborously-24.png",
      48: "icon/trunk-arborously-48.png",
      96: "icon/trunk-arborously-96.png",
      128: "icon/trunk-arborously-128.png"
    },
    host_permissions: [
      "http://localhost/*",
      ...GithubIssuesProvider.getMatchPatterns(),
      ...TrelloProvider.getMatchPatterns()
    ]
  },
  vite: () => ({
    plugins: [tailwindcss()],
    modules: ["@wxt-dev/module-react"]
  })
})
