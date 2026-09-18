"use client"

import { useState, type ComponentType, type ReactNode } from "react"
import { Check, KeyRound, LayoutPanelLeft, LockKeyhole, Moon, PanelTop, ShieldCheck, Sun, UserRound } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageContainer } from "@/components/layout/page-container"
import { useUiPreferences } from "@/components/preferences/ui-preferences-provider"
import { setThemePreference, type ThemePreference, useThemePreference } from "@/components/theme/theme-preference"
import { useCurrentUser } from "@/lib/current-user"
import { LANGUAGE_OPTIONS } from "@/lib/i18n"
import { useAdminUsers } from "@/features/five-s/administration/store"
import type { AppLanguage, NavigationPosition } from "@/lib/ui-preferences"
import { cn } from "@/lib/utils"

export default function ProfileSettingsPage() {
  const currentUser = useCurrentUser()
  const directoryUser = useAdminUsers().find((user) => user.id === currentUser.id)
  const { language, navigationPosition, setLanguage, setNavigationPosition } = useUiPreferences()
  const theme = useThemePreference()
  const [preferenceMessage, setPreferenceMessage] = useState("")

  function preferenceChanged(saved: boolean) {
    setPreferenceMessage(saved ? "Preference updated" : "Unable to save this preference. Please try again.")
  }

  return (
    <PageContainer title="Profile Settings" description="Manage your profile, password, and account preferences." className="mx-auto w-full max-w-[1050px]">
      <Tabs defaultValue="profile" className="min-w-0 gap-5">
        <div className="max-w-full overflow-x-auto pb-1">
          <TabsList aria-label="Profile settings sections" className="h-11 min-w-max p-1">
            <TabsTrigger value="profile" className="min-h-9 px-4"><UserRound />Profile</TabsTrigger>
            <TabsTrigger value="security" className="min-h-9 px-4"><ShieldCheck />Security</TabsTrigger>
            <TabsTrigger value="preferences" className="min-h-9 px-4"><PanelTop />Preferences</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <Card><CardContent className="p-5 sm:p-6">
            <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center">
              <Avatar className="size-16 text-lg"><AvatarFallback className="bg-primary/10 font-semibold text-primary">{currentUser.initials}</AvatarFallback></Avatar>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">{currentUser.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Badge variant="muted">{currentUser.role}</Badge><span>{currentUser.primaryZone} · {currentUser.plant}</span></div>
                <p className="mt-2 text-xs text-muted-foreground">Profile photo uploads are not enabled for this frontend MVP.</p>
              </div>
            </section>

            <section className="pt-5">
              <div className="mb-4"><h2 className="font-semibold">Profile information</h2><p className="mt-1 text-sm text-muted-foreground">Identity and assignments are maintained by Administration.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ReadOnlyField label="Full Name" value={currentUser.name} />
                <ReadOnlyField label="Email" value={directoryUser?.email ?? "Not configured"} type="email" />
                <ReadOnlyField label="Employee ID" value={directoryUser?.employeeId ?? currentUser.id} mono />
                <ReadOnlyField label="Role" value={currentUser.role} />
                <ReadOnlyField label="Plant" value={currentUser.plant} />
                <ReadOnlyField label="Zone" value={currentUser.primaryZone} />
              </div>
            </section>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="security">
          <Card><CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><KeyRound className="size-5" /></span><div className="min-w-0"><h2 className="text-lg font-semibold">Password Management</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Password changes will be available once secure account authentication is connected.</p></div></div>
            <div className="mt-5 rounded-xl border bg-muted/25 p-4 text-sm text-muted-foreground"><p className="flex items-center gap-2 font-medium text-foreground"><LockKeyhole className="size-4 text-primary" />Secure authentication required</p><p className="mt-2 leading-6">This frontend MVP does not store passwords in browser storage or mock user records. Password updates must be handled by the future authenticated backend.</p></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card><CardContent className="grid gap-6 p-5 sm:p-6">
            <PreferenceSection title="Language" description="Choose from the languages currently supported by the application.">
              <Select value={language} onValueChange={(value) => value && preferenceChanged(setLanguage(value as AppLanguage))}>
                <SelectTrigger className="min-h-11 w-full sm:max-w-sm" aria-label="Language"><SelectValue /></SelectTrigger>
                <SelectContent>{LANGUAGE_OPTIONS.map((option) => <SelectItem key={option.code} value={option.code}>{option.name}</SelectItem>)}</SelectContent>
              </Select>
            </PreferenceSection>

            <PreferenceSection title="Appearance" description="Use the same theme preference as the application header.">
              <ChoiceGroup label="Appearance" value={theme} options={[{ value: "light", label: "Light", icon: Sun }, { value: "dark", label: "Dark", icon: Moon }]} onChange={(value) => preferenceChanged(setThemePreference(value as ThemePreference))} />
            </PreferenceSection>

            <PreferenceSection title="Navigation" description="Choose how primary product navigation is displayed on larger screens.">
              <ChoiceGroup label="Navigation layout" value={navigationPosition} options={[{ value: "top", label: "Top Navigation", icon: PanelTop }, { value: "left", label: "Sidebar", icon: LayoutPanelLeft }]} onChange={(value) => preferenceChanged(setNavigationPosition(value as NavigationPosition))} />
            </PreferenceSection>

            {preferenceMessage && <p role="status" aria-live="polite" className={cn("text-sm font-medium", preferenceMessage === "Preference updated" ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>{preferenceMessage}</p>}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

function ReadOnlyField({ label, value, type = "text", mono = false }: { label: string; value: string; type?: string; mono?: boolean }) {
  const id = `profile-${label.toLowerCase().replaceAll(" ", "-")}`
  return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><Input id={id} value={value} type={type} readOnly aria-readonly="true" className={cn("min-h-11 bg-muted/35 text-foreground", mono && "font-mono")} /></div>
}

function PreferenceSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <fieldset className="grid gap-3 border-b pb-6 last:border-b-0 last:pb-0"><legend className="font-semibold">{title}</legend><p className="text-sm leading-6 text-muted-foreground">{description}</p>{children}</fieldset>
}

function ChoiceGroup({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string; icon: ComponentType<{ className?: string }> }>; onChange: (value: string) => void }) {
  return <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={label}>{options.map((option) => { const Icon = option.icon; const selected = value === option.value; return <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => onChange(option.value)} className={cn("flex min-h-11 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring", selected ? "border-primary bg-primary/[0.06] text-foreground" : "border-border text-muted-foreground")}><Icon className={cn("size-4", selected && "text-primary")} /><span className="flex-1">{option.label}</span>{selected && <Check className="size-4 text-primary" />}</button> })}</div>
}
