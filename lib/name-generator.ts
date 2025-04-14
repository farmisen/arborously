import { slugify } from "./slugify"
import { type GeneratorOptions, type TicketInfo } from "./types"

const defaultOptions = {
  lower: true,
  replacement: "_"
} as GeneratorOptions

const patterns = ["id", "title", "category"]

export const generateName = (
  template: string,
  ticketInfo: TicketInfo,
  username: string,
  category: string,
  options: GeneratorOptions = defaultOptions
): string => {
  const { id, title, category: ticketCategory } = ticketInfo
  const info = { id, title, category, username }
  const missing = [] as string[]

  // Check for missing fields
  patterns.forEach((pattern) => {
    const lowerPlaceholder = `{${pattern}}`
    const upperPlaceholder = `{${pattern.charAt(0).toUpperCase() + pattern.slice(1)}}`

    if (
      (template.includes(lowerPlaceholder) || template.includes(upperPlaceholder)) &&
      info[pattern as keyof typeof info] === undefined
    ) {
      missing.push(pattern)
    }
  })

  if (missing.length > 0) {
    throw new Error(`Missing template fields: ${missing.join(", ")}`)
  }

  const processField = (value: string | undefined, capitalize: boolean) => {
    if (value === undefined) return ""

    // If skipSlugify is true, don't slugify the value, just handle capitalization
    if (options.skipSlugify) {
      if (capitalize && value.length > 0) {
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
      return value
    }

    // Otherwise, use slugify as before
    const processed = slugify(value, {
      lower: capitalize ? false : options.lower,
      replacement: options.replacement
    })

    if (capitalize && processed.length > 0) {
      return processed.charAt(0).toUpperCase() + processed.slice(1)
    }

    return processed
  }

  // Replace regular and capitalized placeholders
  let result = template

  // Replace id placeholder
  result = result
    .replace("{id}", processField(id, false))
    .replace("{Id}", processField(id, true))

  // Replace title placeholder
  result = result
    .replace("{title}", processField(title, false))
    .replace("{Title}", processField(title, true))

  // Replace category placeholder
  result = result
    .replace("{category}", processField(ticketCategory ?? category, false))
    .replace("{Category}", processField(ticketCategory ?? category, true))

  // Replace username placeholder (not processed through slugify)
  result = result
    .replace("{username}", username)
    .replace("{Username}", username.charAt(0).toUpperCase() + username.slice(1))

  return result
}
