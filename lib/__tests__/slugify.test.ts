import { describe, expect, it } from "vitest"

import { slugify } from "../slugify"

describe("slugify", () => {
  it("should convert basic string to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world")
  })

  it("should handle spaces", () => {
    expect(slugify("This is a test")).toBe("this-is-a-test")
  })

  it("should handle special characters", () => {
    expect(slugify("Special@Characters!")).toBe("special-characters")
  })

  it("should handle multiple spaces", () => {
    expect(slugify("Multiple   Spaces")).toBe("multiple-spaces")
  })

  it("should handle leading and trailing spaces", () => {
    expect(slugify("  Leading and trailing spaces  ")).toBe(
      "leading-and-trailing-spaces"
    )
  })

  it("should handle multiple sequential special characters", () => {
    expect(slugify("Multiple!!!@@@Special^^^Characters")).toBe(
      "multiple-special-characters"
    )
  })

  it("should handle case conversion", () => {
    expect(slugify("UPPERCASE text")).toBe("uppercase-text")
  })

  it("should handle hyphens", () => {
    expect(slugify("hello-world", { replacement: "_" })).toBe("hello_world")
  })

  it("should handle underscores", () => {
    expect(slugify("hello_world")).toBe("hello-world")
  })

  it("should handle underscores and hyphens", () => {
    expect(slugify("under_scores-and-hyphens")).toBe("under-scores-and-hyphens")
  })

  it("should handle numbers", () => {
    expect(slugify("Hello123World456")).toBe("hello123world456")
  })

  it("should handle strings with only special characters", () => {
    // Base64 of "!@#$%^&*()" is "IUAjJCVeJiooKQ=="
    expect(slugify("!@#$%^&*()")).toBe("IUAjJCVeJiooKQ")
  })

  it("should handle empty strings", () => {
    expect(slugify("")).toBe("")
  })

  it("should handle strings with only spaces", () => {
    // Base64 of "    " is "ICAgIA=="
    expect(slugify("    ")).toBe("ICAgIA")
  })

  it("should handle custom replacement character", () => {
    expect(slugify("Hello World", { replacement: "_" })).toBe("hello_world")
  })

  it("should handle custom replacement with special characters", () => {
    expect(slugify("This & That", { replacement: "_" })).toBe("this_that")
  })

  it("should respect lowercase option", () => {
    expect(slugify("Hello World", { lower: false })).toBe("Hello-World")
  })

  it("should respect both custom options", () => {
    expect(slugify("Hello & World", { lower: false, replacement: "_" })).toBe(
      "Hello_World"
    )
  })

  it("should handle leading hyphens", () => {
    expect(slugify("-leading-hyphen")).toBe("leading-hyphen")
  })

  it("should handle trailing hyphens", () => {
    expect(slugify("trailing-hyphen-")).toBe("trailing-hyphen")
  })

  it("should handle consecutive hyphens", () => {
    expect(slugify("multiple---hyphens")).toBe("multiple-hyphens")
  })

  it("should throw for empty replacement character", () => {
    expect(() => slugify("test", { replacement: "" })).toThrow(
      "Replacement character must be a single character"
    )
  })

  it("should throw for multi-character replacement", () => {
    expect(() => slugify("test", { replacement: "--" })).toThrow(
      "Replacement character must be a single character"
    )
  })

  it("should handle punctuation mixed with text", () => {
    expect(slugify("comma, period. semicolon; colon:")).toBe(
      "comma-period-semicolon-colon"
    )
  })

  it("should handle parentheses and brackets", () => {
    expect(slugify("brackets [text] (more) {even}")).toBe("brackets-text-more-even")
  })

  describe("Unicode and emojis handling", () => {
    it("should handle emoji", () => {
      expect(slugify("Hello 👋 World 🌍")).toBe("hello-wave-world-earth-africa")
    })

    it("should handle non-Latin scripts", () => {
      expect(slugify("你好世界")).toBe("Ni-Hao-Shi-Jie")

      expect(slugify("Привет мир")).toBe("privet-mir")

      expect(slugify("مرحبا بالعالم")).toBe("mrHb-bl-lm")
    })

    it("should handle mixed Latin and non-Latin scripts", () => {
      expect(slugify("こんにちは World")).toBe("konnitiha-world")
    })

    it("should handle URL-encoded emoji", () => {
      expect(slugify("%F0%9F%A6%98 Kangaroo")).toBe("kangaroo-kangaroo")
    })

    it("should handle multiple URL-encoded characters", () => {
      expect(slugify("%F0%9F%A6%8A%F0%9F%A6%81")).toBe("fox-face-lion")
    })

    it("should handle mixed URL-encoded and regular emoji", () => {
      expect(slugify("🔧 Fix %F0%9F%94%A7 emoji")).toBe("wrench-fix-wrench-emoji")
    })

    it("should handle URL-encoded non-emoji characters", () => {
      expect(slugify("Hello%20World")).toBe("hello-world")
    })

    it("should handle URL-encoded characters with custom separator", () => {
      expect(slugify("Fix %F0%9F%A6%B0 issue", { replacement: "_" })).toBe("fix_issue")
    })
  })
})
