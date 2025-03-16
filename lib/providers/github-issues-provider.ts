import { type TicketProvider } from "@/lib/ticket-providers-service"
import { type TicketInfo } from "@/lib/types"

// This provider does not extract the title from the URL
// and should be updated to parse the title from the page

export class GithubIssuesProvider implements TicketProvider {
  name = "github-issues"

  // Matches GitHub Issues URLs
  // Examples:
  // - https://github.com/owner/repo/issues/123
  private readonly GITHUB_ISSUES_REGEX =
    /^https?:\/\/(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)\/(issues)\/(\d+)/

  isSupported(url: string): boolean {
    return this.GITHUB_ISSUES_REGEX.test(url)
  }

  parseUrl(url: string): TicketInfo {
    const match = url.match(this.GITHUB_ISSUES_REGEX)

    if (!match) {
      throw new Error("Not a valid GitHub Issues URL")
    }

    const owner = match[1]
    const repo = match[2]
    const type = match[3]
    const issueId = match[4]

    return {
      id: issueId,
      metadata: {
        owner,
        repo,
        type
      }
    }
  }
}
