import { Github, HelpCircle, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

const Icons = () => {
  return (
    <div className="flex items-center gap-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={async () => {
                await browser.tabs.create({
                  url: "https://github.com/farmisen/arborously"
                })
                window.close()
              }}>
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub Repository</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>GitHub Repository</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Documentation</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Documentation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={async () => {
                await browser.runtime.openOptionsPage()
                window.close()
              }}>
              <Settings className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Options</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Icons
