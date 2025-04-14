import { useCallback, useEffect, useState } from "react"

import { getCurrentTicketInfoService } from "@/lib/current-ticket-info-service"
import { generateName } from "@/lib/name-generator"
import { getSettingsStorageService } from "@/lib/settings-storage-service"
import { type Category, PopupMode, type Settings, type TicketInfo } from "@/lib/types"

const settingsStorageService = getSettingsStorageService()
const currentTicketInfoService = getCurrentTicketInfoService()

export type PopupState = {
  branchName: string
  prTitle: string
  categories: Category[]
  currentCategoryIndex: number
  ticketInfo: TicketInfo | null
  settings: Settings | null
  mode: PopupMode
  version: string
}

export type TemplateGenerationActions = {
  changeCategory: (direction: "prev" | "next") => void
  fetchTemplates: () => Promise<void>
  changeMode: () => void
}

export const usePopup = (): [PopupState, TemplateGenerationActions] => {
  // State
  const [branchName, setBranchName] = useState("")
  const [prTitle, setPrTitle] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [mode, setMode] = useState<PopupMode>(PopupMode.BRANCH_NAME)
  const [version, setVersion] = useState("")

  /**
   * Fetch and set the extension version from the manifest
   */
  const fetchExtensionVersion = useCallback(() => {
    try {
      // Get the manifest object
      const manifest = browser.runtime.getManifest()
      // Update the HTML element
      setVersion(manifest.version)
    } catch (error) {
      console.error("Error fetching extension manifest:", error)
      setVersion("N/A")
    }
  }, [])

  /**
   * Generate both templates based on current data with robust error handling
   * @returns Object containing branchName and prTitle (empty strings if generation fails)
   */
  const generateTemplates = useCallback(
    (
      currentSettings: Settings,
      currentTicketInfo: TicketInfo,
      categoryIndex: number
    ): { branchName: string; prTitle: string } => {
      try {
        // Validate inputs
        if (!currentSettings || !currentTicketInfo) {
          console.error(
            "Missing required settings or ticket info for template generation"
          )
          return { branchName: "", prTitle: "" }
        }

        // Validate category index and settings structure
        if (
          categoryIndex < 0 ||
          !currentSettings.categories ||
          categoryIndex >= currentSettings.categories.length ||
          !currentSettings.templates?.branchName ||
          !currentSettings.templates?.prTitle
        ) {
          console.error(`Invalid settings or category index: ${categoryIndex}`)
          return { branchName: "", prTitle: "" }
        }

        const categoryName = currentSettings.categories[categoryIndex].name

        // Generate branch name with error handling
        let branchName = ""
        try {
          branchName = generateName(
            currentSettings.templates.branchName,
            currentTicketInfo,
            currentSettings.username,
            categoryName,
            {
              lower: currentSettings.enforceLowercase,
              replacement: currentSettings.replacementCharacter
            }
          )
        } catch (error) {
          console.error("Error generating branch name:", error)
        }

        // Generate PR title with error handling
        let prTitle = ""
        try {
          prTitle = generateName(
            currentSettings.templates.prTitle,
            currentTicketInfo,
            currentSettings.username,
            categoryName,
            {
              lower: false,
              replacement: " ",
              skipSlugify: true // Skip slugification for PR titles
            }
          )
        } catch (error) {
          console.error("Error generating PR title:", error)
        }

        return { branchName, prTitle }
      } catch (error) {
        console.error("Unexpected error in template generation:", error)
        return { branchName: "", prTitle: "" }
      }
    },
    []
  )

  // Function to fetch templates based on the current URL
  const fetchTemplates = useCallback(async () => {
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

        // Use the last selected category if available, otherwise use the first one
        const initialCategoryIndex = settingsData.lastSelectedCategoryIndex ?? 0
        setCurrentCategoryIndex(initialCategoryIndex)

        // Use the last selected mode if available
        if (settingsData.lastSelectedMode) {
          setMode(settingsData.lastSelectedMode)
        }
        const parsedTicketInfo = await currentTicketInfoService.get(url)

        if (parsedTicketInfo) {
          setTicketInfo(parsedTicketInfo)

          // Generate both templates at once
          const { branchName: name, prTitle: title } = generateTemplates(
            settingsData,
            parsedTicketInfo,
            initialCategoryIndex
          )

          setBranchName(name)
          setPrTitle(title)
        } else {
          setTicketInfo(null)
          setBranchName("")
          setPrTitle("")
        }
      }
    } catch (error) {
      console.error("Error in fetchTemplates:", error)
    }
  }, [generateTemplates])

  // Function to change the current category - only active in branch name mode
  const changeCategory = useCallback(
    (direction: "prev" | "next") => {
      // Only allow category switching in branch name mode
      if (mode !== PopupMode.BRANCH_NAME) return

      if (!categories.length || !ticketInfo || !settings) return

      // Calculate new category index
      let newIndex = currentCategoryIndex
      if (direction === "prev") {
        newIndex = (currentCategoryIndex - 1 + categories.length) % categories.length
      } else {
        newIndex = (currentCategoryIndex + 1) % categories.length
      }

      setCurrentCategoryIndex(newIndex)

      // Save the selected category index
      if (settings) {
        const updatedSettings = { ...settings, lastSelectedCategoryIndex: newIndex }
        settingsStorageService.set(updatedSettings).catch((error) => {
          console.error("Failed to save category selection:", error)
        })
      }

      // Generate both templates at once with the new category
      const { branchName: name, prTitle: title } = generateTemplates(
        settings,
        ticketInfo,
        newIndex
      )

      setBranchName(name)
      setPrTitle(title)
    },
    [currentCategoryIndex, categories, ticketInfo, settings, generateTemplates, mode]
  )

  // Function to cycle through modes
  const changeMode = useCallback(() => {
    setMode((currentMode) => {
      let newMode: PopupMode
      if (currentMode === PopupMode.BRANCH_NAME) newMode = PopupMode.PR_TITLE
      else if (currentMode === PopupMode.PR_TITLE) newMode = PopupMode.TICKET_URL
      else newMode = PopupMode.BRANCH_NAME

      // Save the selected mode
      if (settings) {
        const updatedSettings = { ...settings, lastSelectedMode: newMode }
        settingsStorageService.set(updatedSettings).catch((error) => {
          console.error("Failed to save mode selection:", error)
        })
      }

      return newMode
    })
  }, [settings])

  useEffect(() => {
    void fetchExtensionVersion()
  }, [fetchExtensionVersion])

  return [
    {
      branchName,
      prTitle,
      categories,
      currentCategoryIndex,
      ticketInfo,
      settings,
      mode,
      version
    },
    {
      changeCategory,
      fetchTemplates,
      changeMode
    }
  ]
}
