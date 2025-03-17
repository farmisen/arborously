import React from "react"
import ReactDOM from "react-dom/client"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/lib/theme-provider"

import OptionsPage from "./OptionsPage"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster />
      <OptionsPage />
    </ThemeProvider>
  </React.StrictMode>
)
