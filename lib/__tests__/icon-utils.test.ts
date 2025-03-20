import { describe, expect, it } from "vitest"

import { getIconPaths } from "../icon-utils"
import { IconType } from "../types"

describe("icon-utils", () => {
  describe("getIconPaths", () => {
    it("should generate correct icon paths for TRUNK type", () => {
      const result = getIconPaths(IconType.TRUNK)

      expect(result).toEqual({
        "16": "icon/trunk-arborously-16.png",
        "24": "icon/trunk-arborously-24.png",
        "48": "icon/trunk-arborously-48.png",
        "96": "icon/trunk-arborously-96.png",
        "128": "icon/trunk-arborously-128.png"
      })
    })

    it("should generate correct icon paths for TREE type", () => {
      const result = getIconPaths(IconType.TREE)

      expect(result).toEqual({
        "16": "icon/tree-arborously-16.png",
        "24": "icon/tree-arborously-24.png",
        "48": "icon/tree-arborously-48.png",
        "96": "icon/tree-arborously-96.png",
        "128": "icon/tree-arborously-128.png"
      })
    })
  })
})
