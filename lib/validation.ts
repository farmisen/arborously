export const invalidGitBranchChars = /[\s~^:?*[\]\\.]/
export const validPlaceholders = ["{id}", "{title}", "{category}", "{username}"]

export const hasInvalidGitBranchChars = (value: string): boolean =>
  invalidGitBranchChars.test(value)

export const findInvalidGitBranchChars = (value: string): string[] => {
  const invalidChars: string[] = []
  const possibleInvalidChars = [" ", "~", "^", ":", "?", "*", "[", "]", "\\", "."]

  possibleInvalidChars.forEach((char) => {
    if (value.includes(char)) {
      invalidChars.push(char === " " ? "space" : char)
    }
  })

  return invalidChars
}

export const isValidTemplate = (value: string): boolean => {
  let valueWithoutPlaceholders = value
  validPlaceholders.forEach((placeholder) => {
    valueWithoutPlaceholders = valueWithoutPlaceholders.replaceAll(placeholder, "")
  })

  return !hasInvalidGitBranchChars(valueWithoutPlaceholders)
}

export const findInvalidTemplateChars = (value: string): string[] => {
  let valueWithoutPlaceholders = value
  validPlaceholders.forEach((placeholder) => {
    valueWithoutPlaceholders = valueWithoutPlaceholders.replaceAll(placeholder, "")
  })

  return findInvalidGitBranchChars(valueWithoutPlaceholders)
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
