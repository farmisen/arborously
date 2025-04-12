import * as emoji from "node-emoji"
import unidecode from "unidecode"

/**
 * Default options for slugify function
 */
const defaultOptions = {
  lower: true,
  replacement: "-"
}

/**
 * Converts a string into a git branch friendly slug
 *
 * The function performs the following operations:
 * 1. Converts the string to lowercase (if option.lower is true)
 * 2. Replaces non-alphanumeric characters with the replacement character
 * 3. Removes leading and trailing replacement characters
 * 4. Replaces multiple consecutive replacement characters with a single one
 * 5. If the result is empty and input is not empty, encodes the original string as base64 (without padding)
 *
 * @param str - The string to be converted to a slug
 * @param option - Optional configuration object
 * @returns A git branch friendly slug string, or base64 encoding if no valid slug characters exist
 */
export const slugify = (
  str: string,
  option?: { lower?: boolean; replacement?: string }
): string => {
  const opts = { ...defaultOptions, ...option }

  if (!opts.replacement || opts.replacement.length > 1 || opts.replacement === "") {
    throw new Error("Replacement character must be a single character")
  }

  // Process the string in steps
  let result = opts.lower ? str.toLowerCase() : str

  try {
    result = decodeURIComponent(result)
  } catch (error) {
    console.error("Failed to decode URI:", error)
  }

  // Replace emojis with their text representation
  result = emoji.unemojify(result)

  // Replace non-ASCII characters with their closest ASCII equivalent
  result = unidecode(result)


  // Replace non-alphanumeric characters with the replacement character
  result = result.replace(/[^a-z0-9]+/gi, opts.replacement)

  // Remove leading and trailing replacement characters
  const escapedReplacement = opts.replacement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  result = result.replace(
    new RegExp(`^${escapedReplacement}+|${escapedReplacement}+$`, "g"),
    ""
  )

  // Replace multiple consecutive replacement characters with a single one
  result = result.replace(new RegExp(`${escapedReplacement}+`, "g"), opts.replacement)

  // If the result is empty, convert the original string to base64 and remove padding
  if (result === "" && str !== "") {
    const utf8Encode = new TextEncoder().encode(str)
    const binaryString = String.fromCharCode(...utf8Encode)
    return btoa(binaryString).replaceAll("=", "").replaceAll("/", opts.replacement)
  }

  return result
}
