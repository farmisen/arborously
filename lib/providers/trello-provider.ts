import { type TicketProvider } from "@/lib/ticket-providers-service"
import { type TicketInfo } from "@/lib/types"

export class TrelloProvider implements TicketProvider {
  private readonly TRELLO_CARD_REGEX =
    /^https?:\/\/(?:www\.)?trello\.com\/c\/([a-zA-Z0-9]+)(?:\/(\d+)(?:-([^/]+))?)?/
  
  titleSelector = "#card-back-name"

  static getMatchPatterns(): string[] {
    return ["https://trello.com/*/*/*", "https://www.trello.com/*/*/*"]
  }

  isTicketUrl(url: string): boolean {
    return this.TRELLO_CARD_REGEX.test(url)
  }

  extractTicketInfo(url: string, titleText?: string): TicketInfo {
    const match = url.match(this.TRELLO_CARD_REGEX)

    if (!match) {
      throw new Error("Not a valid Trello card URL")
    }

    // Use the title from the HTML element if available, otherwise fall back to URL parsing
    const title = titleText || (match[3] ? match[3].split("?")[0].replace(/-/g, " ") : undefined)

    return {
      url,
      id: match[2],
      title,
      metadata: { uuid: match[1] }
    }
  }
}
