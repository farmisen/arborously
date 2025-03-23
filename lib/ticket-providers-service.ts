import { defineProxyService } from "@webext-core/proxy-service"

import { registerAllProviders } from "@/lib/providers"
import { type TicketInfo } from "@/lib/types"

// Base provider interface that platform-specific parsers must implement
export interface TicketProvider {
  isTicketUrl(url: string): boolean
  titleSelector?: string
  extractTicketInfo(url: string, titleText?: string): TicketInfo
}

export type TicketProvidersService = {
  registerProvider(provider: TicketProvider): void
  isTicketUrl(url: string): boolean
  extractTicketInfo(url: string, titleText?: string): TicketInfo
  getTitleSelector(url: string): string | undefined
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

    isTicketUrl(url: string) {
      return providers.some((provider) => provider.isTicketUrl(url))
    },

    getTitleSelector(url: string): string | undefined {
      const provider = providers.find((provider) => provider.isTicketUrl(url))
      return provider?.titleSelector
    },

    extractTicketInfo(url: string, titleText?: string): TicketInfo {
      const provider = providers.find((provider) => provider.isTicketUrl(url))

      if (!provider) {
        throw new Error(`No provider found for URL: ${url}`)
      }

      return provider.extractTicketInfo(url, titleText)
    }
  }

  registerAllProviders(service)
  return service
}

export const [registerTicketProvidersService, getTicketProvidersService] =
  defineProxyService("ticket-providers-service", createTicketProvidersService)
