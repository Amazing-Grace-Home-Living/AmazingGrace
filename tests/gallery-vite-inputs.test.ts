import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Gallery routes in Vite multi-page build inputs", () => {
  it("includes all gallery index pages in rollupOptions.input", () => {
    const viteConfig = fs.readFileSync("vite.config.ts", "utf8");

    const expectedGalleryInputs = [
      "galleries/index.html",
      "galleries/1142-7th-street/index.html",
      "galleries/1144-7th-street/index.html",
      "galleries/926-poinsettia/index.html",
      "galleries/tampa-property/index.html",
      "galleries/ministry/index.html",
      "galleries/ministry-outreach/index.html",
    ];

    for (const galleryInput of expectedGalleryInputs) {
      expect(viteConfig).toContain(galleryInput);
    }
  });
});
