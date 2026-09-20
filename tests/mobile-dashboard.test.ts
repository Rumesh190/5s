/**
 * Mobile Dashboard — characterization tests.
 *
 * Verifies that the mobile dashboard helpers and selectors:
 *  - use canonical data (no fabricated data)
 *  - derive correct counts from live stores
 *  - generate correct greetings
 *  - derive recent activity from real records only
 *  - do not fabricate zone names or counts
 *
 * These are unit tests for the pure helper functions exported from
 * MobileDashboard.tsx — no DOM rendering needed.
 */

import { describe, it, expect } from "vitest";

import {
  getGreeting,
  formatRelativeTime,
  deriveRecentActivity,
} from "@/features/five-s/components/MobileDashboard";
import { MY_ACTIONS } from "@/features/five-s/data/my-actions-data";
import { FIVE_S_AUDITS } from "@/features/five-s/data/five-s-data";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";

/* =========================================================
   getGreeting
   ========================================================= */

describe("getGreeting", () => {
  it("returns a non-empty string", () => {
    expect(getGreeting()).toBeTruthy();
  });

  it("returns one of the three valid greetings", () => {
    const valid = ["Good morning", "Good afternoon", "Good evening"];
    expect(valid).toContain(getGreeting());
  });
});

/* =========================================================
   formatRelativeTime
   ========================================================= */

describe("formatRelativeTime", () => {
  it("returns 'Just now' for very recent timestamps", () => {
    const iso = new Date(Date.now() - 30_000).toISOString();
    expect(formatRelativeTime(iso)).toBe("Just now");
  });

  it("returns minutes for timestamps < 1 hour ago", () => {
    const iso = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(formatRelativeTime(iso)).toBe("5m ago");
  });

  it("returns hours for timestamps 1-23 hours ago", () => {
    const iso = new Date(Date.now() - 3 * 60 * 60_000).toISOString();
    expect(formatRelativeTime(iso)).toBe("3h ago");
  });

  it("returns 'Yesterday' for timestamps ~1 day ago", () => {
    const iso = new Date(Date.now() - 25 * 60 * 60_000).toISOString();
    expect(formatRelativeTime(iso)).toBe("Yesterday");
  });

  it("returns days for timestamps 2-6 days ago", () => {
    const iso = new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString();
    expect(formatRelativeTime(iso)).toBe("3d ago");
  });
});

/* =========================================================
   deriveRecentActivity — uses CANONICAL data only
   ========================================================= */

describe("deriveRecentActivity", () => {
  it("returns at most `limit` items (default 5)", () => {
    const activity = deriveRecentActivity(FIVE_S_AUDITS, MY_ACTIONS);
    expect(activity.length).toBeLessThanOrEqual(5);
  });

  it("respects a custom limit", () => {
    const activity = deriveRecentActivity(FIVE_S_AUDITS, MY_ACTIONS, 3);
    expect(activity.length).toBeLessThanOrEqual(3);
  });

  it("items are sorted newest first (descending date)", () => {
    const activity = deriveRecentActivity(FIVE_S_AUDITS, MY_ACTIONS);
    for (let i = 1; i < activity.length; i++) {
      expect(activity[i - 1].date >= activity[i].date).toBe(true);
    }
  });

  it("each item has a valid href", () => {
    const activity = deriveRecentActivity(FIVE_S_AUDITS, MY_ACTIONS);
    activity.forEach((item) => {
      expect(item.href).toMatch(/^\//);
    });
  });

  it("each item has a label and sublabel", () => {
    const activity = deriveRecentActivity(FIVE_S_AUDITS, MY_ACTIONS);
    activity.forEach((item) => {
      expect(typeof item.label).toBe("string");
      expect(item.label.length).toBeGreaterThan(0);
      expect(typeof item.sublabel).toBe("string");
      expect(item.sublabel.length).toBeGreaterThan(0);
    });
  });

  it("does NOT introduce fabricated zone names not in canonical config", () => {
    const configuredZones = new Set(FIVE_S_ZONE_CONFIGURATION.map((z) => z.name));
    const activity = deriveRecentActivity(FIVE_S_AUDITS, MY_ACTIONS);
    activity.forEach((item) => {
      // sublabel may contain the zone name; if it does it must be canonical
      const zoneMatch = item.sublabel.match(/Zone \w+/);
      if (zoneMatch) {
        expect(configuredZones.has(zoneMatch[0])).toBe(true);
      }
    });
  });

  it("returns an empty array when no audits or actions have dates", () => {
    const activity = deriveRecentActivity([], []);
    expect(activity).toHaveLength(0);
  });
});

/* =========================================================
   Canonical zone check — no Zone E fabrication
   ========================================================= */

describe("Canonical zone configuration", () => {
  it("only contains Zone A, B, C, D — no Zone E", () => {
    const zoneNames = FIVE_S_ZONE_CONFIGURATION.map((z) => z.name);
    expect(zoneNames).not.toContain("Zone E");
    expect(zoneNames).toContain("Zone A");
    expect(zoneNames).toContain("Zone B");
    expect(zoneNames).toContain("Zone C");
    expect(zoneNames).toContain("Zone D");
  });
});
