import { describe, expect, it } from "vitest"

import { generateBranchName } from "../branch-name-generator"
import { type GeneratorOptions, type TicketInfo } from "../types"

describe("generator", () => {
  describe("generate", () => {
    it("should use default category when ticket has no category", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: "Test Ticket"
      }
      const username = "testuser"
      const urlTemplate = "{username}/{category}/{id}-{title}"
      const defaultCategory = "test"

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory
      )

      expect(result).toBe("testuser/test/123-test_ticket")
    })
    it("should replace template variables with corresponding values", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: "Test Ticket",
        category: "Feature"
      }
      const username = "testuser"
      const urlTemplate = "{username}/{category}/{id}-{title}"
      const defaultCategory = "test"

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory
      )

      expect(result).toBe("testuser/feature/123-test_ticket")
    })

    it("should handle empty values by replacing with empty strings", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: ""
      }
      const username = "testuser"
      const urlTemplate = "{username}/{id}-{title}"
      const defaultCategory = "feature"

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory
      )

      expect(result).toBe("testuser/123-")
    })

    it("should throw an error for missing template fields", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        title: "Test Ticket"
      }
      const username = "testuser"
      const urlTemplate = "{username}/{id}-{title}"
      const defaultCategory = "feature"

      expect(() =>
        generateBranchName(urlTemplate, ticketInfo, username, defaultCategory)
      ).toThrow("Missing template fields: id")
    })

    it("should strip out special characters", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: "Special @ Characters & Spaces",
        category: "Test"
      }
      const username = "test.user"
      const urlTemplate = "{username}/{category}/{id}-{title}"
      const defaultCategory = "test"

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory
      )

      expect(result).toBe("test.user/test/123-special_characters_spaces")
    })

    it("should work with just the username field", () => {
      const ticketInfo: TicketInfo = { url: "https://example.com" }
      const username = "testuser"
      const urlTemplate = "{username}/static-path"
      const defaultCategory = "test"

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory
      )

      expect(result).toBe("testuser/static-path")
    })

    it("it should work without the username field", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: "Test Ticket With Spaces",
        category: "Feature"
      }
      const username = "testuser"
      const urlTemplate = "{category}/{id}-{title}"
      const defaultCategory = "test"

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory
      )

      expect(result).toBe("feature/123-test_ticket_with_spaces")
    })

    it("should respect custom replacement character option", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: "Test Ticket With Spaces",
        category: "Feature"
      }
      const username = "testuser"
      const urlTemplate = "{username}/{category}/{id}-{title}"
      const defaultCategory = "test"
      const options: GeneratorOptions = {
        lower: true,
        replacement: "-"
      }

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory,
        options
      )

      expect(result).toBe("testuser/feature/123-test-ticket-with-spaces")
    })

    it("should respect uppercase option", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: "Test Ticket",
        category: "Feature"
      }
      const username = "testuser"
      const urlTemplate = "{username}/{category}/{id}-{title}"
      const defaultCategory = "test"
      const options: GeneratorOptions = {
        lower: false,
        replacement: "_"
      }

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory,
        options
      )

      expect(result).toBe("testuser/Feature/123-Test_Ticket")
    })

    it("should use default options when none are provided", () => {
      const ticketInfo: TicketInfo = {
        url: "https://example.com",
        id: "123",
        title: "Test Ticket",
        category: "Feature"
      }
      const username = "testuser"
      const urlTemplate = "{username}/{category}/{id}-{title}"
      const defaultCategory = "test"

      const result = generateBranchName(
        urlTemplate,
        ticketInfo,
        username,
        defaultCategory
      )

      expect(result).toBe("testuser/feature/123-test_ticket")
    })
  })
})
