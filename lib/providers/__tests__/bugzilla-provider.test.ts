import { describe, expect, it } from "vitest"

import { BugzillaProvider } from "../bugzilla-provider"

describe("BugzillaProvider", () => {
  const provider = new BugzillaProvider()

  describe("getMatchPatterns", () => {
    it("should limit host access to Mozilla Bugzilla issue pages", () => {
      expect(BugzillaProvider.getMatchPatterns()).toEqual([
        "https://bugzilla.mozilla.org/show_bug.cgi*"
      ])
    })
  })

  describe("isTicketUrl", () => {
    it.each([
      "https://bugzilla.mozilla.org/show_bug.cgi?id=1900000",
      "https://bugzilla.mozilla.org/show_bug.cgi?format=multiple&id=1900000",
      "https://bugzilla.mozilla.org/show_bug.cgi?id=1900000&list_id=12345",
      "https://bugzilla.mozilla.org/show_bug.cgi?id=1900000#c3"
    ])("should accept a valid Mozilla Bugzilla URL: %s", (url) => {
      expect(provider.isTicketUrl(url)).toBe(true)
    })

    it.each([
      "https://bugzilla.mozilla.org/",
      "https://bugzilla.mozilla.org/show_bug.cgi",
      "https://bugzilla.mozilla.org/show_bug.cgi?id=",
      "https://bugzilla.mozilla.org/show_bug.cgi?id=not-a-number",
      "https://bugzilla.mozilla.org/attachment.cgi?id=1900000",
      "http://bugzilla.mozilla.org/show_bug.cgi?id=1900000",
      "https://bugs.example.com/show_bug.cgi?id=1900000"
    ])("should reject a non-issue URL: %s", (url) => {
      expect(provider.isTicketUrl(url)).toBe(false)
    })
  })

  describe("extractTicketInfo", () => {
    it("should extract the bug ID and canonical URL", () => {
      const url =
        "https://bugzilla.mozilla.org/show_bug.cgi?list_id=12345&id=1900000#c3"

      expect(provider.extractTicketInfo(url)).toEqual({
        url,
        canonicalUrl: "https://bugzilla.mozilla.org/show_bug.cgi?id=1900000",
        id: "1900000",
        metadata: {
          host: "bugzilla.mozilla.org"
        }
      })
    })

    it("should include a title extracted from the page", () => {
      const url = "https://bugzilla.mozilla.org/show_bug.cgi?id=1900000"

      expect(
        provider.extractTicketInfo(url, "New wpt failures in input events tests")
      ).toEqual({
        url,
        canonicalUrl: url,
        id: "1900000",
        title: "New wpt failures in input events tests",
        metadata: {
          host: "bugzilla.mozilla.org"
        }
      })
    })

    it("should throw for an invalid Bugzilla URL", () => {
      expect(() =>
        provider.extractTicketInfo(
          "https://bugzilla.mozilla.org/show_bug.cgi?id=not-a-number"
        )
      ).toThrow("Not a valid Bugzilla issue URL")
    })
  })
})
