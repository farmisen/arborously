import { type TicketProvider } from "@/lib/ticket-providers-service"
import { type TicketInfo } from "@/lib/types"

export class TrelloProvider implements TicketProvider {
  name = "trello"

  // Matches Trello card URLs
  // Example: https://trello.com/c/abcd1234/123-card-title
  private readonly TRELLO_CARD_REGEX =
    /^https?:\/\/(?:www\.)?trello\.com\/c\/([a-zA-Z0-9]+)(?:\/(\d+)(?:-([^/]+))?)?/

  isSupported(url: string): boolean {
    return this.TRELLO_CARD_REGEX.test(url)
  }

  parseUrl(url: string): TicketInfo {
    const match = url.match(this.TRELLO_CARD_REGEX)

    if (!match) {
      throw new Error("Not a valid Trello card URL")
    }

    return {
      id: match[2],
      title: match[3] ? match[3].replace(/-/g, " ") : undefined,
      metadata: { uuid: match[1] }
    }
  }
}
