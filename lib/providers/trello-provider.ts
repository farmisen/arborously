import { type TicketInfo } from "@/lib/types"
import { type UrlParsingProvider } from "@/lib/url-parsing-service"

export class TrelloProvider implements UrlParsingProvider {
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

    // match[1] = card ID (abcd1234)
    // match[2] = card number (123) - optional
    // match[3] = card title slug (card-title) - optional

    const cardId = match[1]
    const title = match[3] ? match[3].replace(/-/g, " ") : undefined

    return {
      id: cardId,
      title: title,
      category: "trello"
    }
  }
}
