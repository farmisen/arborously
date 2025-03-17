import { Check, ClipboardCopy } from "lucide-react"
import * as React from "react"
import { useCallback, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Icons from "@/entrypoints/popup/Icons"
import { generateBranchName } from "@/lib/branch-name-generator"
import { getSettingsStorageService } from "@/lib/settings-storage-service"
import { getTicketProvidersService } from "@/lib/ticket-providers-service"

const ticketProvidersService = getTicketProvidersService()
const settingsStorageService = getSettingsStorageService()

const Popup = () => {
  const [copied, setCopied] = React.useState(false)
  const [branchName, setBranchName] = React.useState("")

  const fetchBranchName = useCallback(async () => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })
      if (tabs.length > 0) {
        const tab = tabs[0]
        const url = tab.url ?? tab.pendingUrl
        const isSupported = await ticketProvidersService.isSupported(url ?? "")
        if (isSupported) {
          const settings = await settingsStorageService.get()
          const ticketInfo = await ticketProvidersService.parseUrl(url ?? "")
          const template = settings.templates.find(
            (t) => t.id === settings.defaultTemplateId
          )

          if (!template) {
            throw new Error(`Template #${settings.defaultTemplateId} not found`)
          }

          const name = generateBranchName(
            template.template,
            ticketInfo,
            settings.username
          )
          setBranchName(name)
        }
      }
    } catch (error) {
      console.error("Error in fetchBranchName:", error)
    }
  }, [])

  useEffect(() => {
    try {
      fetchBranchName().catch((error) =>
        console.error("Error executing fetchBranchName:", error)
      )
    } catch (error) {
      console.error("Error in useEffect:", error)
    }
  }, [fetchBranchName])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(branchName)
    setCopied(true)
    setTimeout(() => window.close(), 2000)
  }

  return (
    <div className="w-full border-0">
      <div className="space-y-0 pt-1 px-3 flex justify-between items-start bg-accent">
        <div className="flex gap-2 items-baseline">
          <h1 className="text-xl font-bold">Arborously</h1>
          <h2>Git Branch Name Generator</h2>
        </div>
        <Icons />
      </div>
      <Separator />
      <div className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex">
              <Input
                id="generated-branch"
                value={branchName}
                readOnly
                className="rounded-r-none"
              />
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                className="rounded-l-none">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ClipboardCopy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
