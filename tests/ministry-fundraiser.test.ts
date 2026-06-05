import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const testsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testsDir, "..");
const ministryPagePath = resolve(repoRoot, "ministry/index.html");

describe("ministry fundraiser", () => {
  it("highlights the active GoFundMe fundraiser on the ministry page", () => {
    const html = fs.readFileSync(ministryPagePath, "utf8");

    expect(html).toContain("Keeping Hope Afloat");
    expect(html).toContain("https://gofund.me/90bb6b695");
    expect(html).toContain('href="../support/"');
  });
});

