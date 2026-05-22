import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const testsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testsDir, "..");
const ministryPagePath = resolve(repoRoot, "ministry/index.html");

describe("ministry media library", () => {
  it("links preserved audio and music assets from the ministry page", () => {
    const html = fs.readFileSync(ministryPagePath, "utf8");

    const requiredPaths = [
      "../assets/audio/storm.mp3",
      "../assets/audio/victory.mp3",
      "../assets/audio/ending.mp3",
      "../assets/audio/badge.mp3",
      "../assets/audio/course-clear-fanfare.mp3",
      "../assets/audio/player-down.mp3",
      "../assets/music/m64bomb.mid",
      "../assets/music/m64wings.mid",
    ];

    for (const assetPath of requiredPaths) {
      expect(html).toContain(assetPath);
      const repoRelativeAssetPath = assetPath.startsWith("../") ? assetPath.slice(3) : assetPath;
      expect(fs.existsSync(resolve(repoRoot, repoRelativeAssetPath))).toBe(true);
    }
  });
});
