import React from "react"
import ReactDOM from "react-dom/client"

import { ThemeProvider } from "@/lib/theme-provider"

import Popup from "./Popup"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
)
