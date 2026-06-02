import { describe, expect, it } from "vitest";
import fs from "node:fs";

const podcastUrl = "https://copilot.microsoft.com/shares/podcasts/HSYfLkwP2rGW7gy4SUrYv";

describe("podcast library links", () => {
  it("publishes the shared podcast in the main library audio collection", () => {
    const html = fs.readFileSync("library/index.html", "utf8");

    expect(html).toContain("Featured Copilot Podcast");
    expect(html).toContain(podcastUrl);
    expect(html).toContain("Open shared podcast ↗");
  });

  it("publishes the shared podcast in the dedicated audio library page", () => {
    const html = fs.readFileSync("audio-library/index.html", "utf8");

    expect(html).toContain("Featured Copilot Podcast");
    expect(html).toContain(podcastUrl);
    expect(html).toContain("Listen to the shared podcast ↗");
  });
});
