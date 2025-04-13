import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Cleans a URL by removing query parameters and fragments
 * @param url The URL to clean
 * @returns The clean URL with only the path
 */
export const cleanUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const cleanPathname = decodeURIComponent(urlObj.pathname)
    return `${urlObj.origin}${cleanPathname}`
  } catch (error) {
    console.error("Failed to clean URL:", error)
    return url
  }
}
