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
