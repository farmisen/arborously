import { type TicketProvider } from "@/lib/ticket-providers-service"
import { type TicketInfo } from "@/lib/types"

export class TrelloProvider implements TicketProvider {
  private readonly TRELLO_CARD_REGEX =
    /^https?:\/\/(?:www\.)?trello\.com\/c\/([a-zA-Z0-9]+)(?:\/(\d+)(?:-([^/]+))?)?/

  static getMatchPatterns(): string[] {
    return ["https://trello.com/*/*/*", "https://www.trello.com/*/*/*"]
  }

  isTicketUrl(url: string): boolean {
    return this.TRELLO_CARD_REGEX.test(url)
  }

  extractTicketInfo(url: string, _titleText?: string): TicketInfo {
    const match = url.match(this.TRELLO_CARD_REGEX)

    if (!match) {
      throw new Error("Not a valid Trello card URL")
    }

    // Strip query parameters from title if present
    const cleanTitle = match[3] ? match[3].split("?")[0].replace(/-/g, " ") : undefined

    return {
      url,
      id: match[2],
      title: cleanTitle,
      metadata: { uuid: match[1] }
    }
  }
}
