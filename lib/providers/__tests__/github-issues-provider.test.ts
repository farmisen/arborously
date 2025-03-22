import { describe, expect, it } from "vitest"

import { GithubIssuesProvider } from "../github-issues-provider"

describe("GithubIssuesProvider", () => {
  const provider = new GithubIssuesProvider()

  describe("isValidUrl", () => {
    it("should return true for valid GitHub issue URLs", () => {
      expect(provider.isTicketUrl("https://github.com/facebook/react/issues/123")).toBe(
        true
      )
      expect(
        provider.isTicketUrl("https://github.com/microsoft/typescript/issues/45678")
      ).toBe(true)
      expect(provider.isTicketUrl("http://github.com/owner/repo/issues/1")).toBe(true)
      expect(provider.isTicketUrl("https://www.github.com/owner/repo/issues/999")).toBe(
        true
      )
    })

    it("should return false for invalid GitHub URLs", () => {
      expect(provider.isTicketUrl("https://github.com/facebook/react")).toBe(false)
      expect(provider.isTicketUrl("https://github.com/facebook/react/tree/main")).toBe(
        false
      )
      expect(
        provider.isTicketUrl("https://github.com/facebook/react/blob/main/README.md")
      ).toBe(false)
      expect(provider.isTicketUrl("https://github.com/facebook")).toBe(false)
      expect(provider.isTicketUrl("https://github.com")).toBe(false)
      expect(provider.isTicketUrl("https://gitlab.com/owner/repo/issues/123")).toBe(
        false
      )
      expect(provider.isTicketUrl("https://github.com/facebook/react/pull/123")).toBe(
        false
      )
    })
  })

  describe("extractTicketInfo", () => {
    it("should correctly extract info from GitHub issue URLs", () => {
      const url = "https://github.com/facebook/react/issues/123"
      const result = provider.extractTicketInfo(url)

      expect(result).toEqual({
        url,
        id: "123",
        metadata: {
          owner: "facebook",
          repo: "react",
          type: "issues"
        }
      })
    })

    it("should include title when titleText is provided", () => {
      const url = "https://github.com/facebook/react/issues/123"
      const titleText = "Test Issue Title"

      const result = provider.extractTicketInfo(url, titleText)

      expect(result).toEqual({
        url,
        id: "123",
        title: "Test Issue Title",
        metadata: {
          owner: "facebook",
          repo: "react",
          type: "issues"
        }
      })
    })

    it("should throw an error for invalid GitHub URLs", () => {
      expect(() =>
        provider.extractTicketInfo("https://github.com/facebook/react")
      ).toThrow("Not a valid GitHub Issues URL")
      expect(() =>
        provider.extractTicketInfo("https://gitlab.com/owner/repo/issues/123")
      ).toThrow("Not a valid GitHub Issues URL")
    })
  })
})
