import { describe, expect, it } from "vitest"

import { GithubIssuesProvider } from "../github-issues-provider"

describe("GithubIssuesProvider", () => {
  const provider = new GithubIssuesProvider()

  describe("isSupported", () => {
    it("should return true for valid GitHub issue URLs", () => {
      expect(provider.isSupported("https://github.com/facebook/react/issues/123")).toBe(
        true
      )
      expect(
        provider.isSupported("https://github.com/microsoft/typescript/issues/45678")
      ).toBe(true)
      expect(provider.isSupported("http://github.com/owner/repo/issues/1")).toBe(true)
      expect(provider.isSupported("https://www.github.com/owner/repo/issues/999")).toBe(
        true
      )
    })

    it("should return false for invalid GitHub URLs", () => {
      expect(provider.isSupported("https://github.com/facebook/react")).toBe(false)
      expect(provider.isSupported("https://github.com/facebook/react/tree/main")).toBe(
        false
      )
      expect(
        provider.isSupported("https://github.com/facebook/react/blob/main/README.md")
      ).toBe(false)
      expect(provider.isSupported("https://github.com/facebook")).toBe(false)
      expect(provider.isSupported("https://github.com")).toBe(false)
      expect(provider.isSupported("https://gitlab.com/owner/repo/issues/123")).toBe(
        false
      )
      expect(provider.isSupported("https://github.com/facebook/react/pull/123")).toBe(
        false
      )
    })
  })

  describe("parseUrl", () => {
    it("should correctly parse GitHub issue URLs", () => {
      const url = "https://github.com/facebook/react/issues/123"
      const result = provider.parseUrl(url)

      expect(result).toEqual({
        id: "123",
        metadata: {
          owner: "facebook",
          repo: "react",
          type: "issues"
        }
      })
    })

    it("should throw an error for invalid GitHub URLs", () => {
      expect(() => provider.parseUrl("https://github.com/facebook/react")).toThrow(
        "Not a valid GitHub Issues URL"
      )
      expect(() =>
        provider.parseUrl("https://gitlab.com/owner/repo/issues/123")
      ).toThrow("Not a valid GitHub Issues URL")
    })
  })
})
