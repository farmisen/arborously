export type TicketInfo = {
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

export type IconPaths = Record<string, string>

export type GeneratorOptions = {
  lower: boolean
  replacement: string
}

export type Template = {
  id: string
  name: string
  template: string
}

export type Category = {
  id: string
  name: string
}

export type NonEmptyCategoryArray = [Category, ...Category[]]

export type NonEmptyTemplateArray = [Template, ...Template[]]

export type Settings = {
  username: string
  templates: NonEmptyTemplateArray
  defaultTemplate: string
  categories: NonEmptyCategoryArray
  defaultCategory: string
  enforceLowercase: boolean
  replacementCharacter: string
}
