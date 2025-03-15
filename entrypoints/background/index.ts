import { getIconPaths } from "@/lib/icon-utils"
import { IconType } from "@/lib/types"
import { registerUrlParsingService } from "@/lib/url-parsing-service"

const urlParsingService = registerUrlParsingService()
// Helper function to handle tab changes and avoid async in event listeners
const handleTabChange = async (tabId: number) => {
  const tab = await browser.tabs.get(tabId)
  if (tab.active) {
    const url = tab.url ?? tab.pendingUrl
    const isSupported = urlParsingService.isSupported(url ?? "")
    console.log("Active Tab URL: " + url + " supported:" + isSupported)
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
