import { describe, expect, it } from "vitest"

import { cleanUrl } from "../utils"

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
