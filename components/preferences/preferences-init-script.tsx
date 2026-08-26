import { DEFAULT_UI_PREFERENCES, UI_PREFERENCES_STORAGE_KEY } from "@/lib/ui-preferences"

const initScript = `
(function () {
  try {
    var defaults = ${JSON.stringify(DEFAULT_UI_PREFERENCES)};
    var stored = JSON.parse(localStorage.getItem(${JSON.stringify(UI_PREFERENCES_STORAGE_KEY)}) || "null") || {};
    var navigation = stored.navigationPosition === "left" ? "left" : defaults.navigationPosition;
    var accents = ["indigo", "blue", "teal", "emerald", "orange", "rose"];
    var accent = accents.indexOf(stored.accentColor) >= 0 ? stored.accentColor : defaults.accentColor;
    document.documentElement.dataset.navigation = navigation;
    document.documentElement.dataset.accent = accent;
  } catch (_) {
    document.documentElement.dataset.navigation = "top";
    document.documentElement.dataset.accent = "indigo";
  }
})();`

function PreferencesInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: initScript }} />
}

export { PreferencesInitScript }
