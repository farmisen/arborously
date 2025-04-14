import { type TicketProvidersService } from "@/lib/ticket-providers-service"

import { GithubIssuesProvider } from "./github-issues-provider"
import { LinearProvider } from "./linear-provider"
import { TrelloProvider } from "./trello-provider"

export const registerAllProviders = (service: TicketProvidersService) => {
  // Register providers
  service.registerProvider(new TrelloProvider())
  service.registerProvider(new GithubIssuesProvider())
  service.registerProvider(new LinearProvider())
}
