import { type TicketProvider } from "@/lib/ticket-providers-service"
import { type TicketInfo } from "@/lib/types"

export class LinearProvider implements TicketProvider {
  titleSelector = ".ProseMirror.editor[aria-label='Issue title'] p.text-node"

  private readonly LINEAR_ISSUE_REGEX =
    /^https?:\/\/linear\.app\/([^\/]+)\/issue\/([^\/]+)-(\d+)(?:\/([^?]*))?/

  static getMatchPatterns(): string[] {
    return ["https://linear.app/*/issue/*/*"]
  }

  isTicketUrl(url: string): boolean {
    return this.LINEAR_ISSUE_REGEX.test(url)
  }

  extractTicketInfo(url: string, titleText?: string): TicketInfo {
    const match = url.match(this.LINEAR_ISSUE_REGEX)

    if (!match) {
      throw new Error("Not a valid Linear issue URL")
    }

    const workspace = match[1]
    const projectCode = match[2]
    const issueNumber = match[3]
    const issueId = `${projectCode}-${issueNumber}`

    // Clean up URL-encoded title if present in the URL
    const urlTitle = match[4] ? match[4].replace(/-/g, " ") : undefined

    const baseInfo: TicketInfo = {
      url,
      id: issueId,
      metadata: {
        workspace,
        projectCode,
        issueNumber
      }
    }

    if (titleText) {
      return {
        ...baseInfo,
        title: titleText
      }
    } else if (urlTitle) {
      return {
        ...baseInfo,
        title: urlTitle
      }
    }

    return baseInfo
  }
}
