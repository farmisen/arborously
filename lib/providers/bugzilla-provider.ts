import { type TicketProvider } from "@/lib/ticket-providers-service"
import { type TicketInfo } from "@/lib/types"

type ParsedBugzillaUrl = {
  bugId: string
  url: URL
}

const parseBugzillaUrl = (value: string): ParsedBugzillaUrl | undefined => {
  try {
    const url = new URL(value)
    const bugId = url.searchParams.get("id")

    if (
      url.protocol !== "https:" ||
      url.hostname !== "bugzilla.mozilla.org" ||
      url.pathname !== "/show_bug.cgi" ||
      !bugId ||
      !/^\d+$/.test(bugId)
    ) {
      return undefined
    }

    return { bugId, url }
  } catch {
    return undefined
  }
}

export class BugzillaProvider implements TicketProvider {
  titleSelector = "#field-value-short_desc, #short_desc_nonedit_display"

  static getMatchPatterns(): string[] {
    return ["https://bugzilla.mozilla.org/show_bug.cgi*"]
  }

  isTicketUrl(url: string): boolean {
    return parseBugzillaUrl(url) !== undefined
  }

  extractTicketInfo(url: string, titleText?: string): TicketInfo {
    const parsedUrl = parseBugzillaUrl(url)

    if (!parsedUrl) {
      throw new Error("Not a valid Bugzilla issue URL")
    }

    const { bugId, url: urlObject } = parsedUrl
    const ticketInfo: TicketInfo = {
      url,
      canonicalUrl: `${urlObject.origin}${urlObject.pathname}?id=${bugId}`,
      id: bugId,
      metadata: {
        host: urlObject.hostname
      }
    }

    if (titleText) {
      ticketInfo.title = titleText
    }

    return ticketInfo
  }
}
