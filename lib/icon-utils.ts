import { type IconPaths, type IconType } from "./types"

const iconSizes = [16, 24, 48, 96, 128]

/**
 * Returns paths to icons of different sizes for the given icon type
 */
export const getIconPaths = (iconType: IconType): IconPaths =>
  iconSizes.reduce((acc, val) => {
    acc[val.toString()] = `icon/${iconType}-${val}.png`
    return acc
  }, {} as IconPaths)
