import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("stories page blog feature", () => {
  const html = fs.readFileSync("stories/index.html", "utf8");

  it("is now a simple archive page with link back to Library", () => {
    expect(html).toContain('Stories Archive');
    expect(html).toContain('Back to Library');
    expect(html).toContain('href="../library/"');
  });

  it("keeps the stories page wired to the story catalog and contact-aware navigation", () => {
    expect(html).toContain("loadStories();");
    expect(html).toContain('href="../contact/"');
    expect(html).toContain('id="story-list"');
  });

  it("defines the shared dark-theme color tokens used by the stories page", () => {
    expect(html).toContain("--border: #1e293b;");
    expect(html).toContain("--text: #e2e8f0;");
    expect(html).toContain("--muted: #94a3b8;");
    expect(html).toContain("--accent: #38bdf8;");
  });
});
