import { readFile } from "node:fs/promises"
import { describe, expect, it } from "vitest"

describe("Profile Settings", () => {
  it("renders the real tabbed settings page and removes the placeholder", async () => {
    const [route, profile] = await Promise.all([
      readFile("app/(app)/profile/page.tsx", "utf8"),
      readFile("features/five-s/profile/profile-settings-page.tsx", "utf8"),
    ])
    expect(route).toContain("<ProfileSettingsPage />")
    expect(profile).toContain('title="Profile Settings"')
    expect(profile).toContain('value="profile"')
    expect(profile).toContain('value="security"')
    expect(profile).toContain('value="preferences"')
    expect(`${route}${profile}`).not.toContain("Profile settings are coming soon")
    expect(`${route}${profile}`).not.toContain("account preferences will be built here")
  })

  it("uses canonical current-user identity and keeps administered fields read-only", async () => {
    const profile = await readFile("features/five-s/profile/profile-settings-page.tsx", "utf8")
    expect(profile).toContain("useCurrentUser()")
    expect(profile).toContain("useAdminUsers()")
    expect(profile).toContain("currentUser.initials")
    expect(profile).toContain("readOnly")
    for (const label of ["Full Name", "Email", "Employee ID", "Role", "Plant", "Zone"]) expect(profile).toContain(`label="${label}"`)
    expect(profile).not.toContain("Change Photo")
  })

  it("does not persist or fake passwords", async () => {
    const profile = await readFile("features/five-s/profile/profile-settings-page.tsx", "utf8")
    expect(profile).toContain("Password Management")
    expect(profile).toContain("secure account authentication")
    expect(profile).not.toContain('type="password"')
    expect(profile).not.toContain("localStorage")
  })

  it("reuses canonical language, navigation, and theme preferences", async () => {
    const [profile, toggle, provider] = await Promise.all([
      readFile("features/five-s/profile/profile-settings-page.tsx", "utf8"),
      readFile("components/theme/theme-toggle.tsx", "utf8"),
      readFile("components/preferences/ui-preferences-provider.tsx", "utf8"),
    ])
    expect(profile).toContain("useUiPreferences()")
    expect(profile).toContain("setLanguage")
    expect(profile).toContain("setNavigationPosition")
    expect(profile).toContain("useThemePreference()")
    expect(toggle).toContain("useThemePreference()")
    expect(provider).toContain("safeSetStorage(UI_PREFERENCES_STORAGE_KEY")
  })

  it("keeps tabs scrollable and forms single-column first on mobile", async () => {
    const profile = await readFile("features/five-s/profile/profile-settings-page.tsx", "utf8")
    expect(profile).toContain("overflow-x-auto")
    expect(profile).toContain("min-w-max")
    expect(profile).toContain("grid gap-4 sm:grid-cols-2")
    expect(profile).toContain("min-h-11")
  })
})
