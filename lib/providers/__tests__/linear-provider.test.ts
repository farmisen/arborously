import { describe, expect, it } from "vitest"

import { LinearProvider } from "../linear-provider"

describe("LinearProvider", () => {
  const provider = new LinearProvider()

  describe("isValidUrl", () => {
    it("should return true for valid Linear issue URLs", () => {
      expect(
        provider.isTicketUrl(
          "https://linear.app/codery-royale/issue/ENG-12/properly-type-the-client-methods-arguments"
        )
      ).toBe(true)
      expect(
        provider.isTicketUrl(
          "https://linear.app/company/issue/ABC-123/feature-description"
        )
      ).toBe(true)
      expect(
        provider.isTicketUrl("http://linear.app/team/issue/TEAM-456/bug-fix")
      ).toBe(true)
      expect(
        provider.isTicketUrl("https://www.linear.app/workspace/issue/WS-789/some-task")
      ).toBe(false)
    })

    it("should return false for invalid Linear URLs", () => {
      expect(provider.isTicketUrl("https://linear.app/workspace")).toBe(false)
      expect(provider.isTicketUrl("https://linear.app/workspace/issues")).toBe(false)
      expect(provider.isTicketUrl("https://linear.app/workspace/issue")).toBe(false)
      expect(provider.isTicketUrl("https://linear.app/workspace/issue/ABC")).toBe(false)
      expect(provider.isTicketUrl("https://linear.app")).toBe(false)
      expect(
        provider.isTicketUrl("https://app.linear.com/workspace/issue/ABC-123")
      ).toBe(false)
      expect(provider.isTicketUrl("https://github.com/org/repo/issues/123")).toBe(false)
    })
  })

  describe("extractTicketInfo", () => {
    it("should correctly extract info from Linear issue URLs", () => {
      const url =
        "https://linear.app/speakrphone/issue/SPE-342/checkfix-spacing-for-the-followerfollowingtalks-info"
      const result = provider.extractTicketInfo(url)

      expect(result).toEqual({
        url,
        id: "SPE-342",
        title: "checkfix spacing for the followerfollowingtalks info",
        metadata: {
          workspace: "speakrphone",
          projectCode: "SPE",
          issueNumber: "342"
        }
      })
    })

    it("should include title when titleText is provided", () => {
      const url = "https://linear.app/company/issue/ABC-123/feature-description"
      const titleText = "Original Feature Title from DOM"

      const result = provider.extractTicketInfo(url, titleText)

      expect(result).toEqual({
        url,
        id: "ABC-123",
        title: "Original Feature Title from DOM",
        metadata: {
          workspace: "company",
          projectCode: "ABC",
          issueNumber: "123"
        }
      })
    })

    it("should handle URLs without title slugs", () => {
      const url = "https://linear.app/company/issue/ABC-123"
      const result = provider.extractTicketInfo(url)

      expect(result).toEqual({
        url,
        id: "ABC-123",
        metadata: {
          workspace: "company",
          projectCode: "ABC",
          issueNumber: "123"
        }
      })
    })

    it("should throw an error for invalid Linear URLs", () => {
      expect(() => provider.extractTicketInfo("https://linear.app/workspace")).toThrow(
        "Not a valid Linear issue URL"
      )
      expect(() =>
        provider.extractTicketInfo("https://github.com/org/repo/issues/123")
      ).toThrow("Not a valid Linear issue URL")
    })
  })
})
