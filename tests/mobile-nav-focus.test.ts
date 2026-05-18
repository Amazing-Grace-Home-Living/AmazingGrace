import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("top-level navigation consistency", () => {
  const home = fs.readFileSync("index.html", "utf8");
  const stories = fs.readFileSync("stories/index.html", "utf8");
  const ministry = fs.readFileSync("ministry/index.html", "utf8");

  it("uses direct HTML navigation instead of hamburger toggles on the main pages", () => {
    for (const html of [home, stories, ministry]) {
      expect(html).toContain('aria-label="Main navigation"');
      expect(html).not.toContain('menu-toggle');
      expect(html).not.toContain('Toggle navigation');
    }
  });

  it("removes the Amazing Grace text from the main nav logo and keeps Seven Stars in page content", () => {
    expect(home).not.toContain('<span>Amazing Grace Home Living</span>');
    expect(ministry).not.toContain('<span>Amazing Grace</span>');
    expect(stories).toContain('Open Seven Stars Journey');
    expect(stories).toContain('href="../ministries/"');
    expect(ministry).toContain('Seven Stars Journey');
    expect(ministry).not.toContain('href="../ministries/" class="nav-btn"');
  });
});
