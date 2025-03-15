import { describe, expect, it } from "vitest"

import { getIconPaths } from "../icon-utils"
import { IconType } from "../types"

describe("icon-utils", () => {
  describe("getIconPaths", () => {
    it("should generate correct icon paths for TRUNK type", () => {
      const result = getIconPaths(IconType.TRUNK)

      expect(result).toEqual({
        "16": "icon/trunk-16.png",
        "24": "icon/trunk-24.png",
        "48": "icon/trunk-48.png",
        "96": "icon/trunk-96.png",
        "128": "icon/trunk-128.png"
      })
    })

    it("should generate correct icon paths for TREE type", () => {
      const result = getIconPaths(IconType.TREE)

      expect(result).toEqual({
        "16": "icon/tree-16.png",
        "24": "icon/tree-24.png",
        "48": "icon/tree-48.png",
        "96": "icon/tree-96.png",
        "128": "icon/tree-128.png"
      })
    })
  })
})
