import { describe, expect, it } from "vitest"

import { generateName } from "../branch-name-generator"
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

      const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

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

      const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

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

      const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

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
        generateName(urlTemplate, ticketInfo, username, defaultCategory)
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

      const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

      expect(result).toBe("test.user/test/123-special_characters_spaces")
    })

    it("should work with just the username field", () => {
      const ticketInfo: TicketInfo = { url: "https://example.com" }
      const username = "testuser"
      const urlTemplate = "{username}/static-path"
      const defaultCategory = "test"

      const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

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

      const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

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

      const result = generateName(
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

      const result = generateName(
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

      const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

      expect(result).toBe("testuser/feature/123-test_ticket")
    })

    describe("emoji handling", () => {
      it("should handle tickets with basic emoji in title", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "Test Ticket with 👍 emoji",
          category: "Feature"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        expect(result).toBe("testuser/feature/123-test_ticket_with_1_emoji")
      })

      it("should handle tickets with multiple emoji in title", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "✨ New Feature 🚀 with Multiple Emoji 🎉",
          category: "Feature"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        expect(result).toBe(
          "testuser/feature/123-sparkles_new_feature_rocket_with_multiple_emoji_tada"
        )
      })

      it("should handle tickets with only emoji in title", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "🚀✨🔥",
          category: "Feature"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        expect(result).toBe("testuser/feature/123-rocket_sparkles_fire")
      })

      it("should handle bug emoji in title and preserve surrounding text", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "Fix 🐛 in login process",
          category: "Bug"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        expect(result).toBe("testuser/bug/123-fix_bug_in_login_process")
      })

      it("should handle tickets with emoji and custom replacement character", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "Fix 🐛 in the authentication 🔒 system",
          category: "Bug"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"
        const options: GeneratorOptions = {
          lower: true,
          replacement: "-"
        }

        const result = generateName(
          urlTemplate,
          ticketInfo,
          username,
          defaultCategory,
          options
        )

        expect(result).toBe(
          "testuser/bug/123-fix-bug-in-the-authentication-lock-system"
        )
      })

      it("should handle tickets with complex unicode characters and emoji", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "🌈 Support for UTF-8 characters: é, ü, ñ, 你好, こんにちは 🌏",
          category: "Enhancement"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        expect(result).toBe(
          "testuser/enhancement/123-rainbow_support_for_utf_8_characters_e_u_n_Ni_Hao_konnitiha_earth_asia"
        )
      })

      it("should handle URL-encoded emoji in title", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "Fix issue with %F0%9F%A6%98 emoji",
          category: "Feature"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        expect(result).toBe("testuser/feature/123-fix_issue_with_kangaroo_emoji")
      })

      it("should handle mixed URL-encoded and regular emoji in title", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "🔧 %F0%9F%A6%98 emoji and 🦊 emoji",
          category: "Bug"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        // Both the regular emoji and the URL-encoded ones should be processed
        expect(result).toBe("testuser/bug/123-wrench_kangaroo_emoji_and_fox_face_emoji")
      })

      it("should handle title with only URL-encoded emoji", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "%F0%9F%A6%98%F0%9F%A6%8A%F0%9F%A6%81", // URL-encoded 🦘🦊🦁
          category: "Feature"
        }
        const username = "testuser"
        const urlTemplate = "{username}/{category}/{id}-{title}"
        const defaultCategory = "test"

        const result = generateName(urlTemplate, ticketInfo, username, defaultCategory)

        expect(result).toContain("testuser/feature/123-kangaroo_fox_face_lion")
      })
    })

    describe("capitalization in placeholders", () => {
      it("should capitalize title when using {Title} placeholder", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "test title",
          category: "feature"
        }
        const username = "testuser"
        const template = "[{id}] {Title}"
        const defaultCategory = "test"

        const result = generateName(template, ticketInfo, username, defaultCategory)

        expect(result).toBe("[123] Test_title")
      })

      it("should capitalize multiple placeholder types", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "test title",
          category: "feature"
        }
        const username = "testuser"
        const template = "{Username}/{Category}/{Id}-{Title}"
        const defaultCategory = "test"

        const result = generateName(template, ticketInfo, username, defaultCategory)

        expect(result).toBe("Testuser/Feature/123-Test_title")
      })

      it("should handle mixed capitalized and non-capitalized placeholders", () => {
        const ticketInfo: TicketInfo = {
          url: "https://example.com",
          id: "123",
          title: "test title",
          category: "feature"
        }
        const username = "testuser"
        const template = "{username}/{Category}/{id}-{Title}"
        const defaultCategory = "test"

        const result = generateName(template, ticketInfo, username, defaultCategory)

        expect(result).toBe("testuser/Feature/123-Test_title")
      })
    })
  })
})
