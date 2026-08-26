"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ROUTE_LABELS } from "@/lib/navigation"

function labelForPath(path: string): string {
  const lastSegment = path.split("/").filter(Boolean).pop() ?? path
  return (
    ROUTE_LABELS[path] ??
    lastSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  )
}

/**
 * Derives the breadcrumb trail from the current pathname, so every route
 * gets correct breadcrumbs automatically without per-page wiring. Falls
 * back to a title-cased segment name for routes not in `ROUTE_LABELS`.
 */
function BreadcrumbNav() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((_, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`
    return { path, label: labelForPath(path) }
  })

  // Avoid a redundant "Dashboard > Dashboard" crumb on the landing page.
  if (crumbs.length === 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{crumbs[0].label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <React.Fragment key={crumb.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.path} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { BreadcrumbNav }
