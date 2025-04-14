import { describe, expect, it } from "vitest"

import { TrelloProvider } from "../trello-provider"

describe("TrelloProvider", () => {
  const provider = new TrelloProvider()

  describe("isValidUrl", () => {
    it("should return true for valid Trello card URLs", () => {
      expect(provider.isTicketUrl("https://trello.com/c/abcd1234")).toBe(true)
      expect(provider.isTicketUrl("https://trello.com/c/abcd1234/123-card-title")).toBe(
        true
      )
      expect(provider.isTicketUrl("http://trello.com/c/XYZ789")).toBe(true)
      expect(
        provider.isTicketUrl("https://www.trello.com/c/abcd1234/123-my-card-title")
      ).toBe(true)
      expect(
        provider.isTicketUrl("https://trello.com/c/abcd1234/123-card-title?param=value")
      ).toBe(true)
    })

    it("should return false for invalid Trello URLs", () => {
      expect(provider.isTicketUrl("https://trello.com/b/abcd1234/board-name")).toBe(
        false
      )
      expect(provider.isTicketUrl("https://trello.com/u/username")).toBe(false)
      expect(provider.isTicketUrl("https://trello.com")).toBe(false)
      expect(provider.isTicketUrl("https://asana.com/123")).toBe(false)
    })
  })

  describe("extractTicketInfo", () => {
    it("should correctly extract info from Trello card URLs with minimal info", () => {
      const url = "https://trello.com/c/abcd1234"
      const result = provider.extractTicketInfo(url)

      expect(result).toEqual({
        url,
        id: undefined,
        title: undefined,
        metadata: { uuid: "abcd1234" }
      })
    })

    it("should correctly extract info from Trello card URLs with card number and title", () => {
      const url = "https://trello.com/c/abcd1234/123-card-title"
      const result = provider.extractTicketInfo(url)

      expect(result).toEqual({
        url,
        id: "123",
        title: "card title",
        metadata: { uuid: "abcd1234" }
      })
    })

    it("should correctly handle multi-word card titles", () => {
      const url = "https://trello.com/c/abcd1234/123-implement-new-feature-for-project"
      const result = provider.extractTicketInfo(url)

      expect(result).toEqual({
        url,
        id: "123",
        title: "implement new feature for project",
        metadata: { uuid: "abcd1234" }
      })
    })

    it("should strip query parameters from card titles", () => {
      const url =
        "https://trello.com/c/abcd1234/123-implement-feature?param1=value1&param2=value2"
      const result = provider.extractTicketInfo(url)

      expect(result).toEqual({
        url,
        id: "123",
        title: "implement feature",
        metadata: { uuid: "abcd1234" }
      })
    })

    it("should throw an error for invalid Trello URLs", () => {
      expect(() =>
        provider.extractTicketInfo("https://trello.com/b/abcd1234/board-name")
      ).toThrow("Not a valid Trello card URL")
      expect(() => provider.extractTicketInfo("https://asana.com/123")).toThrow(
        "Not a valid Trello card URL"
      )
    })

    it("should use the provided HTML title when available", () => {
      const url = "https://trello.com/c/abcd1234/123-card-title-from-url"
      const htmlTitle = "🇷🇺 Он должен обрабатывать нелатинские шрифты"
      const result = provider.extractTicketInfo(url, htmlTitle)

      expect(result).toEqual({
        url,
        id: "123",
        title: htmlTitle,
        metadata: { uuid: "abcd1234" }
      })
    })
  })
})
