import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const testsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testsDir, "..");
const galleryIndexPath = resolve(repoRoot, "galleries/index.html");

describe("Gallery index navigation and asset paths", () => {
  it("uses root gallery and asset paths without /public prefixes", () => {
    expect(fs.existsSync(galleryIndexPath)).toBe(true);
    const html = fs.readFileSync(galleryIndexPath, "utf8");

    expect(html).not.toContain("/public/assets/galleries/");
    expect(html).not.toContain('src="../');
    expect(html).not.toContain('href="../');
    expect(html).toContain('href="/galleries/1142-7th-street/"');
    expect(html).toContain('href="/galleries/1144-7th-street/"');
    expect(html).toContain('href="/galleries/926-poinsettia/"');
    expect(html).toContain('href="/galleries/tampa-property/"');
    expect(html).toContain('src="/assets/images/');
    expect(html).toContain('src="/images/926/');
  });
});
