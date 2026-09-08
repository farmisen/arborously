import { describe, expect, it } from "vitest"

import { cleanUrl, getTicketUrl } from "../utils"

describe("cleanUrl", () => {
  it("should remove query parameters from URL", () => {
    expect(cleanUrl("https://example.com/path?query=value")).toBe(
      "https://example.com/path"
    )
  })

  it("should remove fragments from URL", () => {
    expect(cleanUrl("https://example.com/path#fragment")).toBe(
      "https://example.com/path"
    )
  })

  it("should remove both query parameters and fragments", () => {
    expect(cleanUrl("https://example.com/path?query=value#fragment")).toBe(
      "https://example.com/path"
    )
  })

  it("should preserve the path", () => {
    expect(cleanUrl("https://example.com/some/nested/path")).toBe(
      "https://example.com/some/nested/path"
    )
  })

  it("should handle URLs with trailing slashes", () => {
    expect(cleanUrl("https://example.com/path/")).toBe("https://example.com/path/")
  })

  it("should preserve the protocol", () => {
    expect(cleanUrl("http://example.com/path")).toBe("http://example.com/path")
  })

  it("should handle URLs with ports", () => {
    expect(cleanUrl("https://example.com:8080/path?query=value")).toBe(
      "https://example.com:8080/path"
    )
  })

  it("should return the original URL if parsing fails", () => {
    const invalidUrl = "not-a-valid-url"
    expect(cleanUrl(invalidUrl)).toBe(invalidUrl)
  })

  it("should handle URLs URL-encoded emojis", () => {
    expect(cleanUrl("https://example.com:8080/%F0%9F%A6%98")).toBe(
      "https://example.com:8080/🦘"
    )
  })
})

describe("getTicketUrl", () => {
  it("should clean the source URL when no canonical URL is provided", () => {
    expect(
      getTicketUrl({ url: "https://example.com/issues/123?tracking=value#comment" })
    ).toBe("https://example.com/issues/123")
  })

  it("should preserve a provider canonical URL", () => {
    expect(
      getTicketUrl({
        url: "https://bugzilla.mozilla.org/show_bug.cgi?list_id=123&id=1900000#c3",
        canonicalUrl: "https://bugzilla.mozilla.org/show_bug.cgi?id=1900000"
      })
    ).toBe("https://bugzilla.mozilla.org/show_bug.cgi?id=1900000")
  })
})
