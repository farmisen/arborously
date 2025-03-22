import { getCurrentTicketInfoService } from "@/lib/current-ticket-info-service"
import { sendMessage } from "@/lib/messaging"
import { getTicketProvidersService } from "@/lib/ticket-providers-service"

const currentTicketInfoService = getCurrentTicketInfoService()
const ticketProvidersService = getTicketProvidersService()

/**
 * Content script that extracts ticket information from supported web pages.
 * Processes the current URL to determine if it's a valid ticket page,
 * extracts ticket information using the appropriate provider,
 * and stores/broadcasts the ticket data to other parts of the extension.
 */

export default defineContentScript({
  // Set "registration" to runtime so this file isn't listed in manifest
  registration: "runtime",
  // Use an empty array for matches to prevent any host_permissions be added
  //  when using `registration: "runtime"`.
  matches: [],

  async main() {
    await processCurrentUrl()
  }
})

async function processCurrentUrl() {
  try {
    const url = window.location.href

    // Check if the current URL is supported by any of our providers
    const isValidUrl = await ticketProvidersService.isTicketUrl(url)
    if (isValidUrl) {
      // Get the CSS selector for title from the provider
      const titleSelector = await ticketProvidersService.getTitleSelector(url)

      // Extract the title from the DOM if we have a selector
      let titleText: string | undefined
      if (titleSelector) {
        const titleElement = document.querySelector(titleSelector)
        titleText = titleElement?.textContent?.trim()
      }

      // Use the provider to extract ticket info
      const ticketInfo = await ticketProvidersService.extractTicketInfo(url, titleText)

      // Store the ticket info in the current ticket info service
      // and notify the background script
      if (ticketInfo) {
        await currentTicketInfoService.set(url, ticketInfo)
        await sendMessage("ticketInfoNotification", ticketInfo)
      }
    }
  } catch (error) {
    console.error("Error extracting ticket info:", error)
  }
}
