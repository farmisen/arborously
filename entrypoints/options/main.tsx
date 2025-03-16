import React from "react"
import ReactDOM from "react-dom/client"

import { Toaster } from "@/components/ui/sonner"

import OptionsPage from "./OptionsPage"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <OptionsPage />
  </React.StrictMode>
)
