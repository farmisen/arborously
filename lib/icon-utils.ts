import { type IconPaths, type IconType } from "./types"

const iconSizes = [16, 24, 48, 96, 128]

/**
 * Returns paths to icons of different sizes for the given icon type
 */
export const getIconPaths = (iconType: IconType): IconPaths => {
  return iconSizes.reduce((acc, val) => {
    acc[val.toString()] = `icon/${iconType}-arborously-${val}.png`
    return acc
  }, {} as IconPaths)
}
