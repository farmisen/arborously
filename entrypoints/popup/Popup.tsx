import { Check, ClipboardCopy } from "lucide-react"
import * as React from "react"
import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Icons from "@/entrypoints/popup/Icons"
import { generateBranchName } from "@/lib/branch-name-generator"
import { getCurrentTicketInfoService } from "@/lib/current-ticket-info-service"
import { getSettingsStorageService } from "@/lib/settings-storage-service"
import {
  type Category,
  type Settings,
  type Template,
  type TicketInfo
} from "@/lib/types"

const settingsStorageService = getSettingsStorageService()
const currentTicketInfoService = getCurrentTicketInfoService()

const Popup = () => {
  const [copied, setCopied] = React.useState(false)
  const [branchName, setBranchName] = React.useState("")
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0)
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)

  const fetchBranchName = useCallback(async () => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })
      if (tabs.length > 0) {
        const tab = tabs[0]
        const url = tab.url ?? tab.pendingUrl
        if (!url) {
          return
        }

        const settingsData = await settingsStorageService.get()
        setSettings(settingsData)
        setCategories(settingsData.categories)

        const defaultCategoryIndex = settingsData.categories.findIndex(
          (c) => c.id === settingsData.defaultCategoryId
        )

        if (defaultCategoryIndex === -1) {
          console.error(`Category #${settingsData.defaultCategoryId} not found`)
          throw new Error(`Category #${settingsData.defaultCategoryId} not found`)
        }

        setCurrentCategoryIndex(defaultCategoryIndex)
        setCurrentCategory(settingsData.categories[defaultCategoryIndex])
        setTemplates(settingsData.templates)

        const defaultIndex = settingsData.templates.findIndex(
          (t) => t.id === settingsData.defaultTemplateId
        )

        if (defaultIndex === -1) {
          throw new Error(`Template #${settingsData.defaultTemplateId} not found`)
        }

        setCurrentTemplateIndex(defaultIndex)

        const parsedTicketInfo = await currentTicketInfoService.get(url)

        if (parsedTicketInfo) {
          setTicketInfo(parsedTicketInfo)

          const name = generateBranchName(
            settingsData.templates[defaultIndex].template,
            parsedTicketInfo,
            settingsData.username,
            settingsData.categories[defaultCategoryIndex].name
          )
          setBranchName(name)
        } else {
          setTicketInfo(null)
          setBranchName("")
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

  const changeTemplate = useCallback(
    (direction: "prev" | "next") => {
      if (!templates.length || !ticketInfo || !settings || !currentCategory) return

      let newIndex = currentTemplateIndex
      if (direction === "prev") {
        newIndex = (currentTemplateIndex - 1 + templates.length) % templates.length
      } else {
        newIndex = (currentTemplateIndex + 1) % templates.length
      }

      setCurrentTemplateIndex(newIndex)

      const name = generateBranchName(
        templates[newIndex].template,
        ticketInfo,
        settings.username,
        currentCategory.name
      )
      setBranchName(name)
    },
    [currentTemplateIndex, templates, ticketInfo, settings, currentCategory]
  )

  const changeCategory = useCallback(
    (direction: "prev" | "next") => {
      if (
        !categories.length ||
        !ticketInfo ||
        !settings ||
        !templates[currentTemplateIndex]
      )
        return

      let newIndex = currentCategoryIndex
      if (direction === "prev") {
        newIndex = (currentCategoryIndex - 1 + categories.length) % categories.length
      } else {
        newIndex = (currentCategoryIndex + 1) % categories.length
      }

      setCurrentCategoryIndex(newIndex)
      setCurrentCategory(categories[newIndex])

      const name = generateBranchName(
        templates[currentTemplateIndex].template,
        ticketInfo,
        settings.username,
        categories[newIndex].name
      )
      setBranchName(name)
    },
    [
      currentCategoryIndex,
      categories,
      currentTemplateIndex,
      templates,
      ticketInfo,
      settings
    ]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a") {
        changeTemplate("prev")
      } else if (e.key === "d") {
        changeTemplate("next")
      } else if (e.key === "w") {
        changeCategory("prev")
      } else if (e.key === "s") {
        changeCategory("next")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [changeTemplate, changeCategory])

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
        <div className="space-y-2">
          {/* branch name */}
          <div className="flex">
            <Input
              id="generated-branch"
              value={branchName}
              readOnly
              disabled
              className="rounded-r-none"
            />
            <Button
              onClick={copyToClipboard}
              variant="secondary"
              className="rounded-l-none"
              disabled={!branchName}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <ClipboardCopy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </div>

          {/* navigation */}
          <div className="text-sm text-muted-foreground">
            <div className="flex justify-start mb-1 ">
              <div className="flex gap-2">
                <div>
                  Template: {currentTemplateIndex + 1}/{templates.length}
                </div>
                <div>
                  (<kbd className="px-1 bg-muted rounded">a</kbd>/
                  <kbd className="px-1 bg-muted rounded">d</kbd>)
                </div>
                <div>
                  Category: {currentCategoryIndex + 1}/{categories.length}
                </div>
                <div>
                  (<kbd className="px-1 bg-muted rounded">w</kbd>/
                  <kbd className="px-1 bg-muted rounded">s</kbd>)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
