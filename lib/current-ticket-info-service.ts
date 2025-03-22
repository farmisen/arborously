import { defineProxyService } from "@webext-core/proxy-service"

import { type TicketInfo } from "./types"

const ticketInfos = new Map<string, TicketInfo>()

export type CurrentTicketInfoService = {
  set(url: string, ticketInfo: TicketInfo): void
  get(url: string): TicketInfo | undefined
  reset(): void
}

const createCurrentTicketInfoService = (): CurrentTicketInfoService => {
  const service: CurrentTicketInfoService = {
    set(url: string, ticketInfo: TicketInfo): void {
      ticketInfos.set(url, ticketInfo)
    },

    get(url: string): TicketInfo | undefined {
      return ticketInfos.get(url)
    },

    reset() {
      ticketInfos.clear()
    }
  }

  return service
}

export const [registerCurrentTicketInfoService, getCurrentTicketInfoService] =
  defineProxyService("current-ticket-info-service", createCurrentTicketInfoService)
