import { fixupConfigRules, fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import _import from "eslint-plugin-import"
import prettier from "eslint-plugin-prettier"
import unusedImports from "eslint-plugin-unused-imports"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/dist/",
      "**/*.js.map",
      "**/*.d.ts",
      "**/coverage/",
      "**/.wxt/",
      "**/.output/",
      "components/ui",
      ".prettierrc.mjs",
      "eslint.config.mjs"
    ]
  },
  ...fixupConfigRules(
    compat.extends(
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
      "prettier",
      "plugin:import/recommended"
    )
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      prettier,
      "unused-imports": unusedImports,
      import: fixupPluginRules(_import)
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
      }
    },

    settings: {
      "import/resolver": {
        typescript: true,
        node: true
      }
    },

    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports"
        }
      ],

      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false
          }
        }
      ],

      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto"
        }
      ],

      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],

      "import/no-relative-packages": "error"
    }
  }
]
