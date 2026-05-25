import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("library video section", () => {
  it("features the Voice of Jesus Network YouTube channel in the video collection", () => {
    const html = fs.readFileSync("library/index.html", "utf8");

    expect(html).toContain("📺 Video Collection");
    expect(html).toContain("Voice of Jesus Network");
    expect(html).toContain("https://www.youtube.com/channel/UCPw8Ed4knDZxhlKn5H2T9ow");
    expect(html).toContain('target="_blank" rel="noopener noreferrer"');
  });
});
