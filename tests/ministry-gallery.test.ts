import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const testsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testsDir, "..");
const ministryPagePath = resolve(repoRoot, "ministry/index.html");
const ministryAssetsDir = resolve(repoRoot, "assets/images/ministry");

const requiredFiles = [
  "f848d75b-7d0a-459d-9f8f-4023ac7b4f46.mp4",
  "7a65ebf3-4f2b-4fbf-9fd9-174859d47a1f.mp4",
  "82179453-3283-4aae-b0af-6b8caf68eb9b.mp4",
  "4e5e0fe6-d627-44b3-9e07-b54346aefe5c.MOV",
  "a2715c20-d753-48bb-9ae5-110f60991b75.mp4",
  "610a3d0c-68c5-49c7-b124-9727214036c2.mp4",
  "57466648-ccca-4c11-ae7f-9f61cf8490ea.mp4",
];

describe("ministry gallery", () => {
  it("renders the ministry video gallery with local assets", () => {
    const html = fs.readFileSync(ministryPagePath, "utf8");

    expect(html).toContain("assets/images/ministry/");
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-labelledby="ministry-gallery-heading"');

    for (const file of requiredFiles) {
      expect(html).toContain(`../assets/images/ministry/${file}`);
      expect(fs.existsSync(resolve(ministryAssetsDir, file))).toBe(true);
    }

    const videoRefs = html.match(/\.\.\/assets\/images\/ministry\/[a-zA-Z0-9-]+\.(mp4|MOV)/g) ?? [];
    expect(videoRefs.length).toBeGreaterThanOrEqual(requiredFiles.length);
  });
});
