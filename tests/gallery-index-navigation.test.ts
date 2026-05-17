import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Gallery index navigation and asset paths", () => {
  it("uses root gallery and asset paths without /public prefixes", () => {
    expect(fs.existsSync("galleries/index.html")).toBe(true);
    const html = fs.readFileSync("galleries/index.html", "utf8");

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
