import { defineProxyService } from "@webext-core/proxy-service"
import { defineExtensionStorage } from "@webext-core/storage"

import { DEFAULT_SETTINGS } from "@/lib/constants"

import { type Settings } from "./types"

type StorageSchema = {
  settings: Settings
}
const storage = defineExtensionStorage<StorageSchema>(browser.storage.local)

type SettingsStorageService = {
  set(settings: Settings): Promise<Settings>
  get(): Promise<Settings>
  reset(): Promise<Settings>
}

const createSettingsStorageService = (): SettingsStorageService => {
  const service: SettingsStorageService = {
    async set(settings: Settings): Promise<Settings> {
      let result: Settings
      try {
        await storage.setItem("settings", settings)
        result = await this.get()
      } catch (error) {
        console.error("Failed to set settings:", error)
        result = await this.get()
      }
      return result
    },

    async get(): Promise<Settings> {
      try {
        const settings = await storage.getItem("settings")
        return settings ?? DEFAULT_SETTINGS
      } catch (error) {
        console.error("Failed to get settings:", error)
        return DEFAULT_SETTINGS
      }
    },

    reset(): Promise<Settings> {
      return this.set(DEFAULT_SETTINGS)
    }
  }

  return service
}

export const [registerSettingsStorageService, getSettingsStorageService] =
  defineProxyService("settings-storage-service", createSettingsStorageService)
