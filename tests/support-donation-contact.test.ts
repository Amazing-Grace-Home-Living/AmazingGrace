import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("support donation options", () => {
  it("includes GoFundMe fundraiser + direct contact options", () => {
    const html = fs.readFileSync("support/index.html", "utf8");

    expect(html).toContain('id="donation-email-btn"');
    expect(html).toContain("mailto:admin@amazinggracehl.org");
    expect(html).toContain("tel:+17274202873");
    expect(html).toContain("Keeping Hope Afloat");
    expect(html).toContain("https://gofund.me/90bb6b695");
    expect(html).not.toContain("https://www.paypal.com/donate/");
    expect(html).not.toContain("PAYPAL_BUSINESS");
  });
});
