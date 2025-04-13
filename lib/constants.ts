import { type Settings } from "./types"

export const DEFAULT_SETTINGS: Settings = {
  username: "your_user_name",
  templates: {
    branchName: "{username}/{category}/{id}-{title}",
    prTitle: "[{id}] {Title}"
  },
  categories: [
    { id: "1", name: "feat" },
    { id: "2", name: "bug" },
    { id: "3", name: "chore" },
    { id: "4", name: "docs" },
    { id: "5", name: "refactor" },
    { id: "6", name: "test" }
  ],
  enforceLowercase: true,
  replacementCharacter: "-"
}
