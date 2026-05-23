import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("library video collection", () => {
  it("adds the Voice of Jesus Network as the first video resource above the audio section", () => {
    const html = fs.readFileSync("library/index.html", "utf8");

    expect(html).toContain("📺 Video Collection");
    expect(html).toContain("Voice of Jesus Network");
    expect(html).toContain('href="https://www.youtube.com/channel/UCPw8Ed4knDZxhlKn5H2T9ow"');
    expect(html).toContain("Bible Study video teachings from the Voice of Jesus Network on YouTube.");

    expect(html.indexOf("📺 Video Collection")).toBeLessThan(html.indexOf("🎵 Audio Collection"));
    expect(html.indexOf("🎵 Audio Collection")).toBeLessThan(html.indexOf("Resources"));
  });

  it("embeds the three Voice of Jesus Network YouTube videos in the Video Collection section", () => {
    const html = fs.readFileSync("library/index.html", "utf8");

    expect(html).toContain("https://www.youtube.com/embed/EOOcReGQVuo");
    expect(html).toContain("https://www.youtube.com/embed/aNlPUYeqFn0");
    expect(html).toContain("https://www.youtube.com/embed/jxgcKA9JywM");

    // All three embeds appear before the Audio Collection heading
    const audioIdx = html.indexOf("🎵 Audio Collection");
    expect(html.indexOf("EOOcReGQVuo")).toBeLessThan(audioIdx);
    expect(html.indexOf("aNlPUYeqFn0")).toBeLessThan(audioIdx);
    expect(html.indexOf("jxgcKA9JywM")).toBeLessThan(audioIdx);
  });
});
