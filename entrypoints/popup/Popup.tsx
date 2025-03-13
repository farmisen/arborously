import { Check, ClipboardCopy } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Icons from "@/entrypoints/popup/Icons"

export default function Popup() {
  const [copied, setCopied] = React.useState(false)

  const branchName = "farmisen/PROJ-123/add-new-feature"

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(branchName)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
