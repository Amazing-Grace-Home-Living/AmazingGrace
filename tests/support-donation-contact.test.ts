import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("support donation contact fallback", () => {
  it("uses direct contact links instead of the inactive PayPal donate account", () => {
    const html = fs.readFileSync("support/index.html", "utf8");

    expect(html).toContain('id="donation-email-btn"');
    expect(html).toContain("mailto:admin@amazinggracehl.org");
    expect(html).toContain("tel:+17274202873");
    expect(html).toContain("summer camp");
    expect(html).toContain("Online PayPal giving is temporarily unavailable");
    expect(html).not.toContain("https://www.paypal.com/donate/");
    expect(html).not.toContain("PAYPAL_BUSINESS");
  });
});
