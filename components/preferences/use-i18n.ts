"use client"

import { useCallback } from "react"
import { useUiPreferences } from "@/components/preferences/ui-preferences-provider"
import { actionCategoryKey, localeFor, translate, type TranslationKey } from "@/lib/i18n"

export function useI18n() {
  const { language, setLanguage } = useUiPreferences()
  const t = useCallback((key: TranslationKey) => translate(language, key), [language])
  const formatDate = useCallback((value: string | Date, options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) => new Intl.DateTimeFormat(localeFor(language), options).format(typeof value === "string" ? new Date(value) : value), [language])
  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(localeFor(language), options).format(value), [language])
  const actionCategoryLabel = useCallback((value: string) => { const key = actionCategoryKey(value); return key ? translate(language, key) : value }, [language])
  return { language, setLanguage, locale: localeFor(language), t, formatDate, formatNumber, actionCategoryLabel }
}
