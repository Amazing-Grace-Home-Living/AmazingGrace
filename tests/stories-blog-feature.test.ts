import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("stories page blog feature", () => {
  const html = fs.readFileSync("stories/index.html", "utf8");

  it("includes the featured blog section and first article title", () => {
    expect(html).toContain('<h2 id="featured-blog">Blog</h2>');
    expect(html).toContain('Architectural JS Synthesis of the Matrix of Conscience');
    expect(html).toContain('Table 1: Sequence Stabilizer Hardware Implementation Matrix');
    expect(html).toContain('Table 2: Macroeconomic Scaling and Systemic Governance Metrics');
  });

  it("keeps the stories page wired to the story catalog and contact-aware navigation", () => {
    expect(html).toContain("loadStories();");
    expect(html).toContain('href="../contact/"');
    expect(html).toContain('id="story-list"');
    expect(html).toContain('id="character-list"');
  });

  it("defines the shared dark-theme color tokens used by the stories page", () => {
    expect(html).toContain("--text: #e2e8f0;");
    expect(html).toContain("--surface: rgba(15, 23, 42, 0.92);");
    expect(html).toContain("--accent-soft: rgba(56, 189, 248, 0.14);");
  });
});
