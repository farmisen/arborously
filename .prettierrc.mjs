/**
 * @type {import('prettier').Options}
 */
export default {
  printWidth: 88,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^@/(.*)$", "^[./]" ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}