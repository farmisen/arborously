import { describe, expect, it } from "vitest"

import { TrelloProvider } from "../trello-provider"

describe("TrelloProvider", () => {
  const provider = new TrelloProvider()

  describe("isSupported", () => {
    it("should return true for valid Trello card URLs", () => {
      expect(provider.isSupported("https://trello.com/c/abcd1234")).toBe(true)
      expect(provider.isSupported("https://trello.com/c/abcd1234/123-card-title")).toBe(
        true
      )
      expect(provider.isSupported("http://trello.com/c/XYZ789")).toBe(true)
      expect(
        provider.isSupported("https://www.trello.com/c/abcd1234/123-my-card-title")
      ).toBe(true)
    })

    it("should return false for invalid Trello URLs", () => {
      expect(provider.isSupported("https://trello.com/b/abcd1234/board-name")).toBe(
        false
      )
      expect(provider.isSupported("https://trello.com/u/username")).toBe(false)
      expect(provider.isSupported("https://trello.com")).toBe(false)
      expect(provider.isSupported("https://asana.com/123")).toBe(false)
    })
  })

  describe("parseUrl", () => {
    it("should correctly parse Trello card URLs with minimal info", () => {
      const url = "https://trello.com/c/abcd1234"
      const result = provider.parseUrl(url)

      expect(result).toEqual({
        id: undefined,
        title: undefined,
        metadata: { uuid: "abcd1234" }
      })
    })

    it("should correctly parse Trello card URLs with card number and title", () => {
      const url = "https://trello.com/c/abcd1234/123-card-title"
      const result = provider.parseUrl(url)

      expect(result).toEqual({
        id: "123",
        title: "card title",
        metadata: { uuid: "abcd1234" }
      })
    })

    it("should correctly handle multi-word card titles", () => {
      const url = "https://trello.com/c/abcd1234/123-implement-new-feature-for-project"
      const result = provider.parseUrl(url)

      expect(result).toEqual({
        id: "123",
        title: "implement new feature for project",
        metadata: { uuid: "abcd1234" }
      })
    })

    it("should throw an error for invalid Trello URLs", () => {
      expect(() =>
        provider.parseUrl("https://trello.com/b/abcd1234/board-name")
      ).toThrow("Not a valid Trello card URL")
      expect(() => provider.parseUrl("https://asana.com/123")).toThrow(
        "Not a valid Trello card URL"
      )
    })
  })
})
