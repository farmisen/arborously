export type TicketInfo = {
  url: string
  id?: string
  title?: string
  category?: string
  description?: string
  status?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}

export enum IconType {
  TRUNK = "trunk",
  TREE = "tree"
}

export enum PopupMode {
  BRANCH_NAME = "branchName",
  PR_TITLE = "prTitle",
  TICKET_URL = "ticketUrl"
}

export type IconPaths = Record<string, string>

export type GeneratorOptions = {
  lower: boolean
  replacement: string
  skipSlugify?: boolean
}

export type Category = {
  id: string
  name: string
}

export type NonEmptyCategoryArray = [Category, ...Category[]]

export type Templates = {
  branchName: string
  prTitle: string
}

export type Settings = {
  username: string
  templates: Templates
  categories: NonEmptyCategoryArray
  enforceLowercase: boolean
  replacementCharacter: string
  lastSelectedCategoryIndex?: number
  lastSelectedMode?: PopupMode
}
