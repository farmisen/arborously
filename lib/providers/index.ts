import { type UrlParsingService } from "@/lib/url-parsing-service"

import { BugzillaProvider } from "./bugzilla-provider"
import { GithubIssuesProvider } from "./github-issues-provider"
import { TrelloProvider } from "./trello-provider"

/**
 * Register all URL parsing providers
 */
export const registerAllProviders = (service: UrlParsingService) => {
  // Register providers
  service.registerProvider(new TrelloProvider())
  service.registerProvider(new GithubIssuesProvider())
  service.registerProvider(new BugzillaProvider())
}
