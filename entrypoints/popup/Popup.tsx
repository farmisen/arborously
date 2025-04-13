import { Check, GitBranch, Link, Type } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Icons from "@/entrypoints/popup/Icons"
import { usePopup } from "@/entrypoints/popup/usePopup"
import { PopupMode } from "@/lib/types"
import { cleanUrl } from "@/lib/utils"

const Popup = () => {
  // State for UI
  const [copied, setCopied] = useState(false)
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [copyDisabled, setCopyDisabled] = useState(true)

  const [
    { branchName, prTitle, categories, currentCategoryIndex, ticketInfo, mode },
    { changeCategory, fetchTemplates, changeMode }
  ] = usePopup()

  // Fetch templates on component mount
  useEffect(() => {
    try {
      fetchTemplates().catch((error) =>
        console.error("Error executing fetchTemplates:", error)
      )
    } catch (error) {
      console.error("Error in useEffect:", error)
    }
  }, [fetchTemplates])

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a") {
        changeCategory("prev")
      } else if (e.key === "d") {
        changeCategory("next")
      } else if (e.key === " ") {
        changeMode()
        setCopied(false)
        // Prevent page scrolling
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [changeCategory, changeMode])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => window.close(), 2000)
  }

  useEffect(() => {
    if (mode === PopupMode.BRANCH_NAME) {
      setContent(branchName)
      setDescription("Git Branch Name Generator")
      setCopyDisabled(!branchName)
    } else if (mode === PopupMode.PR_TITLE) {
      setContent(prTitle)
      setDescription("PR Title Generator")
      setCopyDisabled(!prTitle)
    } else if (mode === PopupMode.TICKET_URL && ticketInfo?.url) {
      setContent(cleanUrl(ticketInfo.url))
      setDescription("Ticket URL")
      setCopyDisabled(!ticketInfo.url)
    }
  }, [branchName, prTitle, ticketInfo, mode])

  return (
    <div className="w-full border-0">
      <div className="space-y-0 pt-1 px-3 flex justify-between items-start bg-accent">
        <div className="flex gap-2 items-baseline">
          <h1 className="text-xl font-bold">Arborously</h1>
          <h2 className="italic">{description}</h2>
        </div>
        <Icons />
      </div>
      <Separator />
      <div className="p-4">
        <div className="space-y-2">
          {/* Content display (branch name, PR title, or ticket URL) */}
          <div className="flex">
            <Input
              id="generated-content"
              value={content}
              readOnly
              disabled
              className="rounded-r-none"
            />
            <Button
              onClick={copyToClipboard}
              variant="secondary"
              className="rounded-l-none"
              disabled={copyDisabled}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : mode === PopupMode.BRANCH_NAME ? (
                <GitBranch className="h-4 w-4" />
              ) : mode === PopupMode.PR_TITLE ? (
                <Type className="h-4 w-4" />
              ) : (
                <Link className="h-4 w-4" />
              )}
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </div>

          {/* navigation */}
          <div className="text-sm text-muted-foreground">
            <div className="flex justify-start mb-1 gap-2">
              <div className="flex gap-2">
                <div>
                  Mode:{" "}
                  {mode === PopupMode.BRANCH_NAME
                    ? "Branch Name"
                    : mode === PopupMode.PR_TITLE
                      ? "PR Title"
                      : "Ticket URL"}
                </div>
                <div>
                  (<kbd className="px-1 bg-muted rounded">space</kbd>)
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  Category: {currentCategoryIndex + 1}/{categories.length}
                </div>
                <div>
                  (<kbd className="px-1 bg-muted rounded">a</kbd>/
                  <kbd className="px-1 bg-muted rounded">d</kbd>)
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
