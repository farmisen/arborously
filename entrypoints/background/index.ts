import { getIconPaths } from "@/lib/icon-utils"
import { registerSettingsStorageService } from "@/lib/settings-storage-service"
import { registerTicketProvidersService } from "@/lib/ticket-providers-service"
import { IconType } from "@/lib/types"

// Register services
const ticketProvidersService = registerTicketProvidersService()
registerSettingsStorageService()

// Helper function to handle tab changes and avoid async in event listeners
const handleTabChange = async (tabId: number) => {
  const tab = await browser.tabs.get(tabId)
  if (tab.active) {
    const url = tab.url ?? tab.pendingUrl
    const isSupported = ticketProvidersService.isSupported(url ?? "")
    const iconPaths = getIconPaths(isSupported ? IconType.TREE : IconType.TRUNK)
    await browser.action.setIcon({ path: iconPaths })
  }
}

export default defineBackground(() => {
  browser.tabs.onUpdated.addListener((id) => {
    void (async () => await handleTabChange(id))()
  })

  browser.tabs.onActivated.addListener((info) => {
    void (async () => await handleTabChange(info.tabId))()
  })
})
