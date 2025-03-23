import { z } from "zod"

export const validPlaceholders = ["{id}", "{title}", "{category}", "{username}"]
export const validGitSegmentBranchNameRegex = /^[a-zA-Z0-9_-]+$/
export const validGitSegmentBranchNameWithSlashRegex = /^[a-zA-Z0-9_\/-]+$/

export const isValidGitBranchSegmentName = (value: string): boolean =>
  validGitSegmentBranchNameRegex.test(value)

export const isValidGitBranchSegmentNameWithSlash = (value: string): boolean =>
  validGitSegmentBranchNameWithSlashRegex.test(value)

export const isValidTemplate = (value: string): boolean => {
  let valueWithoutPlaceholders = value
  validPlaceholders.forEach((placeholder) => {
    valueWithoutPlaceholders = valueWithoutPlaceholders.replaceAll(placeholder, "")
  })

  // If there's nothing left after removing placeholders, it's valid
  if (valueWithoutPlaceholders === "") {
    return true
  }

  const isValid = isValidGitBranchSegmentNameWithSlash(valueWithoutPlaceholders)
  return isValid
}

export const findInvalidPlaceholders = (value: string): string[] => {
  const invalidPlaceholders: string[] = []

  const placeholderRegex = /\{([^{}]+)\}/g
  let match

  while ((match = placeholderRegex.exec(value)) !== null) {
    const placeholder = match[0]
    if (!validPlaceholders.includes(placeholder)) {
      invalidPlaceholders.push(placeholder)
    }
  }

  return invalidPlaceholders
}

export const hasInvalidPlaceholders = (value: string): boolean => {
  return findInvalidPlaceholders(value).length > 0
}

export const templateContainsValidPlaceholdersRefinement = z.string().refine(
  (val) => {
    const usedPlaceholders = validPlaceholders.filter((p) => val.includes(p))
    return usedPlaceholders.length > 0
  },
  {
    message: `Template must include at least one valid placeholder: ${validPlaceholders.join(", ")}`
  }
)

export const gitBranchNameRefinement = (message?: string) =>
  z.string().refine((val) => !val || isValidGitBranchSegmentName(val), {
    message:
      message ??
      "Must only contain alphanumeric characters, dashes (-), forward slashes (/), or underscores (_)."
  })

export const templateIsValidRefinement = z
  .string()
  .refine((val) => isValidTemplate(val), {
    message:
      "Outside of placeholders, template must only contain alphanumeric characters, forward slashes (/), dashes (-), or underscores (_)."
  })

export const templateNoInvalidPlaceholdersRefinement = z
  .string()
  .refine((val) => !hasInvalidPlaceholders(val), {
    message: "Template contains invalid placeholders."
  })

export const validateTemplatePattern = (pattern: string): string | null => {
  if (!pattern) {
    return null
  }

  if (!validPlaceholders.some((p) => pattern.includes(p))) {
    return "Must include at least one placeholder."
  }

  if (!isValidTemplate(pattern)) {
    return "Outside of placeholders, template must only contain alphanumeric characters, forward slashes (/), dashes (-), or underscores (_)."
  }

  if (hasInvalidPlaceholders(pattern)) {
    return `Contains invalid placeholders: ${findInvalidPlaceholders(pattern).join(", ")}`
  }

  return null
}
