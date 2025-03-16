import { defineProxyService } from "@webext-core/proxy-service"

import { registerAllProviders } from "@/lib/providers"
import { type TicketInfo } from "@/lib/types"

// Base provider interface that platform-specific parsers must implement
export interface TicketProvider {
  name: string
  isSupported(url: string): boolean
  parseUrl(url: string): TicketInfo
}

export type TicketProvidersService = {
  registerProvider(provider: TicketProvider): void
  isSupported(url: string): boolean
  parseUrl(url: string): TicketInfo
  getProviders(): TicketProvider[]
}

const createTicketProvidersService = (): TicketProvidersService => {
  const providers: TicketProvider[] = []

  const service = {
    registerProvider(provider: TicketProvider) {
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

export const [registerTicketProvidersService, getTicketProvidersService] =
  defineProxyService("ticket-providers-service", createTicketProvidersService)
