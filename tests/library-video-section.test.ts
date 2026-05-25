import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("library video section", () => {
  it("features embedded video cards in the video collection", () => {
    const html = fs.readFileSync("library/index.html", "utf8");

    expect(html).toContain("🎬 Video Collection");
    expect(html).toContain("Matrix of Conscience");
    expect(html).toContain("https://www.youtube.com/embed/GKrXY0zH7lQ");
    expect(html).toContain("Electra Comedy Intro");
    expect(html).toContain("Bible Study");
  });
});
