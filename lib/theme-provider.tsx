import * as React from "react"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    // Media query to detect dark mode
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    // Initial setup
    if (darkModeMediaQuery.matches) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    darkModeMediaQuery.addEventListener("change", handleChange)

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return <>{children}</>
}
