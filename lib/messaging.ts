import { defineExtensionMessaging } from "@webext-core/messaging"

import { type TicketInfo } from "./types"

interface ProtocolMap {
  ticketInfoNotification(ticketInfo: TicketInfo): void
}

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
