import { type TicketProvider } from "@/lib/ticket-providers-service"
import { type TicketInfo } from "@/lib/types"

export class GithubIssuesProvider implements TicketProvider {
  titleSelector = ".markdown-title"

  private readonly GITHUB_ISSUES_REGEX =
    /^https?:\/\/(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)\/(issues)\/(\d+)/

  static getMatchPatterns(): string[] {
    return ["https://github.com/*/*/issues/*", "https://www.github.com/*/*/issues/*"]
  }

  isTicketUrl(url: string): boolean {
    return this.GITHUB_ISSUES_REGEX.test(url)
  }

  extractTicketInfo(url: string, titleText?: string): TicketInfo {
    const match = url.match(this.GITHUB_ISSUES_REGEX)

    if (!match) {
      throw new Error("Not a valid GitHub Issues URL")
    }

    const owner = match[1]
    const repo = match[2]
    const type = match[3]
    const issueId = match[4]

    const baseInfo: TicketInfo = {
      url,
      id: issueId,
      metadata: {
        owner,
        repo,
        type
      }
    }

    if (titleText) {
      return {
        ...baseInfo,
        title: titleText
      }
    }

    return baseInfo
  }
}
