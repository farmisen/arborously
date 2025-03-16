import { type Settings } from "./types"

export const DEFAULT_SETTINGS: Settings = {
  username: "your_user_name",
  templates: [
    { id: "1", name: "Title", template: "{id}-{title}" },
    { id: "2", name: "UserName, Title", template: "{username}/{id}-{title}" },
    {
      id: "3",
      name: "UserName, Category, Title",
      template: "{username}/{category}/{id}-{title}"
    }
  ],
  defaultTemplate: "1",
  categories: [
    { id: "1", name: "feat" },
    { id: "2", name: "bug" },
    { id: "3", name: "chore" },
    { id: "4", name: "docs" },
    { id: "5", name: "refactor" },
    { id: "5", name: "test" }
  ],
  defaultCategory: "1",
  enforceLowercase: true,
  replacementCharacter: "-"
}
