import slug from "slug"

import { type GeneratorOptions, type TicketInfo } from "./types"

const defaultOptions = {
  lower: true,
  replacement: "_"
} as GeneratorOptions

const patterns = ["id", "title", "category"]

export const generateBranchName = (
  urlTemplate: string,
  ticketInfo: TicketInfo,
  username: string,
  options: GeneratorOptions = defaultOptions
) => {
  // should error if a template field is missing a value from TicketInfo
  const { id, title, category } = ticketInfo
  const info = { id, title, category, username }
  const missing = [] as string[]

  patterns.forEach((pattern) => {
    if (
      urlTemplate.includes(`{${pattern}}`) &&
      info[pattern as keyof typeof info] === undefined
    ) {
      missing.push(pattern)
    }
  })

  if (missing.length > 0) {
    throw new Error(`Missing template fields: ${missing.join(", ")}`)
  }

  const processField = (value: string | undefined) => {
    if (value === undefined) return ""
    return slug(value, { lower: options.lower, replacement: options.replacement })
  }

  return urlTemplate
    .replace("{id}", processField(id))
    .replace("{title}", processField(title))
    .replace("{username}", username) // Username is not processed
    .replace("{category}", processField(category))
}
