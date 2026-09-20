import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.join(process.cwd(), "features/five-s/dashboard-page.tsx"), "utf8");

describe("Dashboard Zone filter layout", () => {
  it("keeps Zone and Zone Member as independent, spaced controls", () => {
    expect(source).toContain('aria-label="Zone filters"');
    expect(source).toContain('className="flex min-w-0 flex-wrap items-center gap-2"');
    expect(source).toContain('className="w-40 shrink-0"');
    expect(source).toContain('className="h-11 w-52 shrink-0 md:h-9" aria-label="Zone Member"');
  });

  it("allows the shared filter area to wrap before overlapping Period", () => {
    expect(source).toContain("lg:flex-wrap lg:items-center lg:justify-end lg:gap-x-5");
    expect(source).not.toContain("negative-margin");
  });
});
