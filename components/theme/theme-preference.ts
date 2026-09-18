"use client"

import { useSyncExternalStore } from "react"

import { safeSetStorageString } from "@/lib/browser-storage"

const THEME_STORAGE_KEY = "5s-theme"
export type ThemePreference = "light" | "dark"

let theme: ThemePreference = "light"
let loaded = false
const listeners = new Set<() => void>()

function applyTheme(value: ThemePreference) {
  document.documentElement.classList.toggle("dark", value === "dark")
}

function loadTheme() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  theme = stored === "light" || stored === "dark"
    ? stored
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  applyTheme(theme)
}

function subscribe(listener: () => void) {
  loadTheme()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function snapshot() {
  loadTheme()
  return theme
}

export function setThemePreference(nextTheme: ThemePreference) {
  loadTheme()
  const previous = theme
  theme = nextTheme
  applyTheme(theme)
  const result = safeSetStorageString(THEME_STORAGE_KEY, theme)
  if (!result.success) {
    theme = previous
    applyTheme(theme)
    return false
  }
  listeners.forEach((listener) => listener())
  return true
}

export function useThemePreference() {
  return useSyncExternalStore(subscribe, snapshot, () => "light" as ThemePreference)
}
