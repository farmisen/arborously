// No longer need MATCHES import since we rely on ticketProvidersService
import { registerCurrentTicketInfoService } from "@/lib/current-ticket-info-service"
import { getIconPaths } from "@/lib/icon-utils"
import { onMessage } from "@/lib/messaging"
import { registerSettingsStorageService } from "@/lib/settings-storage-service"
import { registerTicketProvidersService } from "@/lib/ticket-providers-service"
import { IconType, type TicketInfo } from "@/lib/types"

/**
 * Background script
 *
 * Initializes services, monitors tab changes, and handles ticket notifications.
 * When a supported ticket URL is detected, it executes content scripts to extract
 * ticket information and updates the extension icon accordingly.
 *
 * Listens for tab events (updated, activated) and ticket info notifications
 * to maintain the extension state across browser navigation.
 */

// Register services
const ticketProvidersService = registerTicketProvidersService()
registerSettingsStorageService()
registerCurrentTicketInfoService()

const handleTabChange = async (tabId: number) => {
  const tab = await browser.tabs.get(tabId)
  if (tab.active) {
    const url = tab.url ?? tab.pendingUrl
    const isValidURL = url && (url.startsWith("http://") || url.startsWith("https://"))
    const isTicketUrl = url && isValidURL && ticketProvidersService.isTicketUrl(url)

    if (isTicketUrl) {
      // Execute the ticket info extraction script in the context of the active tab DOM
      await browser.scripting.executeScript({
        target: { tabId: tabId },
        files: ["/content-scripts/content.js"]
      })
    } else {
      // Reset the icon if not a valid ticket URL
      const iconPaths = getIconPaths(IconType.TRUNK)
      await (browser.action ?? browser.browserAction).setIcon({ path: iconPaths })
      // disable the tab
      await (browser.action ?? browser.browserAction).disable(tab.id)
    }
  } else {
    // disable the tab
    await (browser.action ?? browser.browserAction).disable(tab.id)
  }
}

const handleTicketInfoNotification = async (ticketInfo: TicketInfo) => {
  // fetch the active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  if (tabs.length > 0) {
    const tab = tabs[0]
    const url = tab.url ?? tab.pendingUrl

    // verify that the notification is for the active tab
    if (url !== ticketInfo.url) {
      console.warn(
        `${url} received notification for a different tab: ${ticketInfo.url}`
      )
      return
    }

    // fetch the icon paths and update the icon
    const iconPaths = getIconPaths(IconType.TREE)
    await (browser.action ?? browser.browserAction).setIcon({ path: iconPaths })
    // enable the tab
    await (browser.action ?? browser.browserAction).enable(tab.id)
  }
}

// Listen for ticket info notifications
onMessage("ticketInfoNotification", ({ data: ticketInfo }) => {
  void (async () => await handleTicketInfoNotification(ticketInfo))()
})

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    void (async () => await (browser.action ?? browser.browserAction).disable())()
  })

  browser.tabs.onUpdated.addListener((id) => {
    void (async () => await handleTabChange(id))()
  })

  browser.tabs.onActivated.addListener((info) => {
    void (async () => await handleTabChange(info.tabId))()
  })

  browser.tabs.onCreated.addListener((tab) => {
    const tabId = tab.id
    if (tabId) {
      void (async () => await handleTabChange(tabId))()
    }
  })

  browser.tabs.onAttached.addListener((tabId) => {
    void (async () => await handleTabChange(tabId))()
  })
})
