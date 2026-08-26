type NavigationPosition = "top" | "left"
type AccentColor = "indigo" | "blue" | "teal" | "emerald" | "orange" | "rose"

interface UiPreferences {
  navigationPosition: NavigationPosition
  accentColor: AccentColor
}

const UI_PREFERENCES_STORAGE_KEY = "5s-ui-preferences"

const DEFAULT_UI_PREFERENCES: UiPreferences = {
  navigationPosition: "top",
  accentColor: "indigo",
}

export {
  DEFAULT_UI_PREFERENCES,
  UI_PREFERENCES_STORAGE_KEY,
  type AccentColor,
  type NavigationPosition,
  type UiPreferences,
}
