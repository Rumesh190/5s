"use client"

import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { setThemePreference, useThemePreference } from "@/components/theme/theme-preference"

function ThemeToggle() {
  const theme = useThemePreference()

  function toggleTheme() {
    const nextTheme =
      theme === "dark" ? "light" : "dark"
    setThemePreference(nextTheme)
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
