"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "5s-theme"

type Theme = "light" | "dark"

function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("light")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    const storedTheme = window.localStorage.getItem(
      STORAGE_KEY
    ) as Theme | null

    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches

    const initialTheme =
      storedTheme ??
      (systemPrefersDark ? "dark" : "light")

    document.documentElement.classList.toggle(
      "dark",
      initialTheme === "dark"
    )

    queueMicrotask(() => {
      if (cancelled) return
      setTheme(initialTheme)
      setMounted(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  function toggleTheme() {
    const nextTheme: Theme =
      theme === "dark" ? "light" : "dark"

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    )

    window.localStorage.setItem(
      STORAGE_KEY,
      nextTheme
    )

    setTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled
      />
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      title={
        isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}

      <span className="sr-only">
        {isDark
          ? "Switch to light theme"
          : "Switch to dark theme"}
      </span>
    </Button>
  )
}

export { ThemeToggle }
