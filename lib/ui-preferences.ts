type NavigationPosition = "top" | "left"
type AccentColor = "indigo" | "blue" | "teal" | "emerald" | "orange" | "rose"
type AppLanguage = "en" | "hi" | "ta" | "bn" | "ja"

interface UiPreferences {
  navigationPosition: NavigationPosition
  accentColor: AccentColor
  language: AppLanguage
}

const UI_PREFERENCES_STORAGE_KEY = "5s-ui-preferences"

const DEFAULT_UI_PREFERENCES: UiPreferences = {
  navigationPosition: "top",
  accentColor: "indigo",
  language: "en",
}

export {
  DEFAULT_UI_PREFERENCES,
  UI_PREFERENCES_STORAGE_KEY,
  type AccentColor,
  type AppLanguage,
  type NavigationPosition,
  type UiPreferences,
}
