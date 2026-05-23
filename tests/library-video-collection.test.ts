import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("library video collection", () => {
  it("adds the Voice of Jesus Network as the first video resource under the audio section", () => {
    const html = fs.readFileSync("library/index.html", "utf8");

    expect(html).toContain("📺 Video Collection");
    expect(html).toContain("Voice of Jesus Network");
    expect(html).toContain('href="https://www.youtube.com/channel/UCPw8Ed4knDZxhlKn5H2T9ow"');
    expect(html).toContain("Bible Study video teachings from the Voice of Jesus Network on YouTube.");

    expect(html.indexOf("🎵 Audio Collection")).toBeLessThan(html.indexOf("📺 Video Collection"));
    expect(html.indexOf("📺 Video Collection")).toBeLessThan(html.indexOf("Resources"));
  });
});
