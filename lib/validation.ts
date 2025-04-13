import { z } from "zod"

// Placeholders for branch names (lowercase only)
const validBranchNamePlaceholders = ["{id}", "{title}", "{category}", "{username}"]

// Placeholders for PR titles (including capitalized versions)
const validPrTitlePlaceholders = [
  "{id}",
  "{title}",
  "{category}",
  "{username}",
  "{Id}",
  "{Title}",
  "{Category}",
  "{Username}"
]

// All valid placeholders (used for PR titles)
const validPlaceholders = [...validPrTitlePlaceholders]
const validGitSegmentBranchNameRegex = /^[a-zA-Z0-9_-]+$/
const validGitSegmentBranchNameWithSlashRegex = /^[a-zA-Z0-9_\/-]+$/

export const isValidGitBranchSegmentName = (value: string): boolean =>
  validGitSegmentBranchNameRegex.test(value)

const isValidGitBranchSegmentNameWithSlash = (value: string): boolean =>
  validGitSegmentBranchNameWithSlashRegex.test(value)

const isValidBranchNameTemplate = (value: string): boolean => {
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

// For PR title template, we allow any character outside of placeholders
const isValidPrTitleTemplate = (_value: string): boolean => {
  // PR title can contain any characters, so we always return true
  return true
}

// Function that determines if a template is valid based on context
const isValidTemplate = (value: string, isPrTitleTemplate = false): boolean => {
  if (isPrTitleTemplate) {
    return isValidPrTitleTemplate(value)
  }
  return isValidBranchNameTemplate(value)
}

const findInvalidPlaceholders = (value: string, forBranchName = false): string[] => {
  const invalidPlaceholders: string[] = []
  const validSet = forBranchName
    ? validBranchNamePlaceholders
    : validPrTitlePlaceholders

  const placeholderRegex = /\{([^{}]+)\}/g
  let match

  while ((match = placeholderRegex.exec(value)) !== null) {
    const placeholder = match[0]
    if (!validSet.includes(placeholder)) {
      invalidPlaceholders.push(placeholder)
    }
  }

  return invalidPlaceholders
}

const hasInvalidPlaceholders = (value: string, forBranchName = false): boolean => {
  return findInvalidPlaceholders(value, forBranchName).length > 0
}

// For branch name templates
export const branchNameTemplateContainsValidPlaceholdersRefinement = z.string().refine(
  (val) => {
    const usedPlaceholders = validBranchNamePlaceholders.filter((p) => val.includes(p))
    return usedPlaceholders.length > 0
  },
  {
    message: `Branch name template must include at least one valid placeholder: ${validBranchNamePlaceholders.join(", ")}`
  }
)

// For PR title templates
export const prTitleTemplateContainsValidPlaceholdersRefinement = z.string().refine(
  (val) => {
    const usedPlaceholders = validPrTitlePlaceholders.filter((p) => val.includes(p))
    return usedPlaceholders.length > 0
  },
  {
    message: `PR title template must include at least one valid placeholder: ${validBranchNamePlaceholders.join(", ")} or their capitalized versions`
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
      "Outside of placeholders, branch name template must only contain alphanumeric characters, forward slashes (/), dashes (-), or underscores (_)."
  })

// For PR titles, we allow any characters outside placeholders
export const prTitleTemplateIsValidRefinement = z
  .string()
  .refine((val) => isValidTemplate(val, true), {
    message: "Template contains invalid characters or placeholders."
  })

export const branchNameTemplateNoInvalidPlaceholdersRefinement = z
  .string()
  .refine((val) => !hasInvalidPlaceholders(val, true), {
    message:
      "Branch name template contains invalid placeholders. Only lowercase placeholders are allowed."
  })

export const prTitleTemplateNoInvalidPlaceholdersRefinement = z
  .string()
  .refine((val) => !hasInvalidPlaceholders(val, false), {
    message: "PR title template contains invalid placeholders."
  })
