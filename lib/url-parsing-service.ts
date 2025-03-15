import { defineProxyService } from "@webext-core/proxy-service"

import { registerAllProviders } from "@/lib/providers"
import { type TicketInfo } from "@/lib/types"

// Base provider interface that platform-specific parsers must implement
export interface UrlParsingProvider {
  name: string
  isSupported(url: string): boolean
  parseUrl(url: string): TicketInfo
}

export type UrlParsingService = {
  registerProvider(provider: UrlParsingProvider): void
  isSupported(url: string): boolean
  parseUrl(url: string): TicketInfo
  getProviders(): UrlParsingProvider[]
}

const createUrlParsingService = (): UrlParsingService => {
  // Registry of providers
  const providers: UrlParsingProvider[] = []

  const service = {
    registerProvider(provider: UrlParsingProvider) {
      providers.push(provider)
    },

    getProviders() {
      return [...providers]
    },

    isSupported(url: string) {
      return providers.some((provider) => provider.isSupported(url))
    },

    parseUrl(url: string): TicketInfo {
      const provider = providers.find((provider) => provider.isSupported(url))

      if (!provider) {
        throw new Error(`No provider found for URL: ${url}`)
      }

      return provider.parseUrl(url)
    }
  }

  registerAllProviders(service)
  return service
}

export const [registerUrlParsingService, getUrlParsingService] = defineProxyService(
  "url-parsing-service",
  createUrlParsingService
)
