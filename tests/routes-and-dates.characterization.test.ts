import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("current 5S route surface", () => {
  it.each([
    "app/(app)/5s/listing/page.tsx",
    "app/(app)/5s/audits/[auditId]/report/page.tsx",
    "app/(app)/5s/actions/[actionId]/page.tsx",
    "app/(app)/5s/actions/[actionId]/report/page.tsx",
    "app/(app)/5s/continuous-improvement/[improvementId]/page.tsx",
    "app/(app)/5s/continuous-improvement/[improvementId]/report/page.tsx",
    "app/(app)/5s/red/[tagId]/page.tsx",
    "app/(app)/5s/red/[tagId]/print/page.tsx",
  ])("keeps %s", (routeFile) => expect(existsSync(resolve(routeFile))).toBe(true));

  it("characterizes encoded audit/action IDs and raw CI/Red Tag IDs", () => {
    const reservedId = "ID /?#";
    expect(`/5s/audits/${encodeURIComponent(reservedId)}/report?from=audit`).toBe(
      "/5s/audits/ID%20%2F%3F%23/report?from=audit",
    );
    expect(`/5s/actions/${encodeURIComponent(reservedId)}/report`).toBe(
      "/5s/actions/ID%20%2F%3F%23/report",
    );
    expect(read("features/five-s/components/FiveSAuditExecution.tsx")).toContain(
      "encodeURIComponent(audit.id)",
    );
    expect(read("features/five-s/action-detail-page.tsx")).toContain(
      "encodeURIComponent(action.id)",
    );
    expect(read("features/five-s/continuous-improvement/module.tsx")).toContain(
      "`/5s/continuous-improvement/${item.id}/report`",
    );
    expect(read("features/five-s/red-tag/red-tag-module.tsx")).toContain(
      "`/5s/red/${tag.id}/print`",
    );
  });
});

describe("date-only timezone behavior", () => {
  function evaluate(tz: string, expression: string) {
    return execFileSync(process.execPath, ["-e", `process.stdout.write(${expression})`], {
      env: { ...process.env, TZ: tz },
      encoding: "utf8",
    });
  }

  it("keeps local-midnight parsing on the same calendar date in two timezone contexts", () => {
    const expression = "new Date('2026-08-27T00:00:00').getDate().toString()";
    expect(evaluate("Asia/Kolkata", expression)).toBe("27");
    expect(evaluate("America/Los_Angeles", expression)).toBe("27");
  });

  it("characterizes the shift risk of parsing a bare ISO date as UTC", () => {
    const expression = "new Date('2026-08-27').getDate().toString()";
    expect(evaluate("Asia/Kolkata", expression)).toBe("27");
    expect(evaluate("America/Los_Angeles", expression)).toBe("26");
  });
});
