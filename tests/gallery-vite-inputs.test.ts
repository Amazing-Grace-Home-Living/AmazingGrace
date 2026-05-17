import { describe, expect, it } from "vitest";
import viteConfig from "../vite.config";

describe("Gallery routes in Vite multi-page build inputs", () => {
  it("includes all gallery index pages in rollupOptions.input", () => {
    const input = viteConfig.build?.rollupOptions?.input;
    expect(input).toBeTruthy();
    expect(typeof input).toBe("object");

    const expectedGalleryInputs = [
      "galleries/index.html",
      "galleries/1142-7th-street/index.html",
      "galleries/1144-7th-street/index.html",
      "galleries/926-poinsettia/index.html",
      "galleries/tampa-property/index.html",
      "galleries/ministry/index.html",
      "galleries/ministry-outreach/index.html",
    ];

    const inputValues = Object.values(input as Record<string, string>).map(String);

    for (const galleryInput of expectedGalleryInputs) {
      expect(inputValues.some((value) => value.endsWith(galleryInput))).toBe(true);
    }
  });
});
