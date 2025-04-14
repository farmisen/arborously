import { zodResolver } from "@hookform/resolvers/zod"
import { Layers, RotateCcw, Settings as SettingsIcon, Tag } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DEFAULT_SETTINGS } from "@/lib/constants"
import { generateName } from "@/lib/name-generator"
import { getSettingsStorageService } from "@/lib/settings-storage-service"
import { type Settings } from "@/lib/types"
import {
  branchNameTemplateContainsValidPlaceholdersRefinement,
  branchNameTemplateNoInvalidPlaceholdersRefinement,
  gitBranchNameRefinement,
  isValidGitBranchSegmentName,
  prTitleTemplateContainsValidPlaceholdersRefinement,
  prTitleTemplateIsValidRefinement,
  prTitleTemplateNoInvalidPlaceholdersRefinement,
  templateIsValidRefinement
} from "@/lib/validation"

import BranchTemplateSettings from "./BranchTemplateSettings"
import CategoriesOptions from "./CategoriesOptions"
import GlobalSettings from "./GlobalSettings"

// Branch name template requires strict validation and lowercase placeholders only
export const branchNameTemplateSchema = z
  .string()
  .min(1, {
    message: "Template pattern is required."
  })
  .pipe(branchNameTemplateContainsValidPlaceholdersRefinement)
  .pipe(templateIsValidRefinement)
  .pipe(branchNameTemplateNoInvalidPlaceholdersRefinement)

// PR title template allows any characters and capitalized placeholders
export const prTitleTemplateSchema = z
  .string()
  .min(1, {
    message: "Template pattern is required."
  })
  .pipe(prTitleTemplateContainsValidPlaceholdersRefinement)
  .pipe(prTitleTemplateIsValidRefinement)
  .pipe(prTitleTemplateNoInvalidPlaceholdersRefinement)

export const categorySchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, {
      message: "Category name must be at least 2 characters."
    })
    .pipe(
      z.string().refine((val) => !val || isValidGitBranchSegmentName(val), {
        message:
          "Category name must only contain alphanumeric characters, dashes (-), or underscores (_)."
      })
    )
})

const formSchema = z.object({
  username: gitBranchNameRefinement(
    "Username must only contain alphanumeric characters, dashes (-), or underscores (_)."
  )
    .optional()
    .or(z.literal("")),
  templates: z.object({
    branchName: branchNameTemplateSchema,
    prTitle: prTitleTemplateSchema
  }),
  categories: z.array(categorySchema).nonempty({
    message: "At least one category is required."
  }),
  enforceLowercase: z.boolean(),
  replacementCharacter: z.string().min(1).max(1)
})

export type FormData = z.infer<typeof formSchema>

const settingsStorageService = getSettingsStorageService()

const TABS = {
  GLOBAL: "global-settings",
  TEMPLATES: "templates",
  CATEGORIES: "categories"
} as const

type TabValue = (typeof TABS)[keyof typeof TABS]

const getInitialTab = (): TabValue => {
  if (typeof window === "undefined") return TABS.GLOBAL

  const hash = window.location.hash.replace("#", "")
  return Object.values(TABS).includes(hash as TabValue)
    ? (hash as TabValue)
    : TABS.GLOBAL
}

const OptionsPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>(getInitialTab)
  const [newCategory, setNewCategory] = useState("")
  const [previewData, setPreviewData] = useState({
    id: "123",
    title: "Add new feature",
    category: "feat",
    username: "your_user_name"
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_SETTINGS,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    criteriaMode: "firstError"
  })

  // Load settings from storage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsStorageService.get()

        form.reset(settings, {
          keepDirty: false,
          keepIsSubmitted: false,
          keepTouched: false,
          keepIsValid: false,
          keepErrors: false,
          keepDefaultValues: false
        })

        // Update preview data with the username from settings
        if (settings.username) {
          setPreviewData((prev) => ({ ...prev, username: settings.username }))
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
        toast.error("Failed to load settings. Using defaults.")
      }
    }

    void loadSettings()
  }, [])

  const showSuccessToast = useDebouncedCallback(() => {
    toast.success("Settings saved", {
      duration: 2000
    })
  }, 1000)

  // Auto-save function
  const saveSettings = async (data: FormData) => {
    try {
      await settingsStorageService.set(data as Settings)
      // Show debounced toast notification
      showSuccessToast()
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to save settings", {
        duration: 3000
      })
    }
  }

  // Track if this is the initial mount to prevent auto-save on load
  const initialMountRef = useRef(true)

  // Auto-save whenever form values change and the form is valid
  useEffect(() => {
    // Skip auto-save on the initial form setup
    if (initialMountRef.current) {
      initialMountRef.current = false
      return
    }

    const subscription = form.watch((value) => {
      if (form.formState.isDirty) {
        // Trigger validation
        void form.trigger().then((isValid) => {
          // Only save if we have a complete form and it's valid
          if (isValid && Object.keys(value).length > 0) {
            void saveSettings(value as FormData)
          }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [form.formState.isValid, form.formState.isDirty, form.trigger, saveSettings])

  const watchTemplates = form.watch("templates")
  const watchCategories = form.watch("categories")
  const watchEnforceLowercase = form.watch("enforceLowercase")
  const watchReplacementCharacter = form.watch("replacementCharacter")
  const watchUsername = form.watch("username")

  const generateBranchNamePreview = () => {
    // Use the first category as default for preview
    const categoryName =
      watchCategories.length > 0 ? watchCategories[0].name : previewData.category

    try {
      return generateName(
        watchTemplates.branchName,
        {
          url: "https://example.com",
          id: previewData.id,
          title: previewData.title,
          category: categoryName
        },
        watchUsername && watchUsername.length > 0
          ? watchUsername
          : previewData.username,
        categoryName,
        {
          lower: watchEnforceLowercase,
          replacement: watchReplacementCharacter
        }
      )
    } catch (error) {
      console.error("Error generating branch name:", error)
      return "Invalid branch name template configuration"
    }
  }

  const generatePrTitlePreview = () => {
    // Use the first category as default for preview
    const categoryName =
      watchCategories.length > 0 ? watchCategories[0].name : previewData.category

    try {
      return generateName(
        watchTemplates.prTitle,
        {
          url: "https://example.com",
          id: previewData.id,
          title: previewData.title,
          category: categoryName
        },
        watchUsername && watchUsername.length > 0
          ? watchUsername
          : previewData.username,
        categoryName,
        {
          // For PR titles, we don't enforce lowercase
          lower: false,
          replacement: " "
        }
      )
    } catch (error) {
      console.error("Error generating PR title:", error)
      return "Invalid PR title template configuration"
    }
  }

  const resetToDefaults = () => {
    void settingsStorageService.reset()
    form.reset(DEFAULT_SETTINGS, {
      keepDirty: false,
      keepTouched: false,
      keepIsValid: false,
      keepErrors: false,
      keepValues: false,
      keepDefaultValues: false
    })
    toast.info("All settings have been reset to default values.", {
      duration: 3000
    })
  }

  // Handle tab changes and update URL hash
  const handleTabChange = useCallback((value: TabValue) => {
    setActiveTab(value)
    window.location.hash = value
  }, [])

  // Listen for hash changes in the URL
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getInitialTab()
      setActiveTab(newTab)
    }

    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Form {...form}>
        <form className="space-y-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Arborously Options</h1>
              <p className="text-muted-foreground">
                Configure your branch and PR title naming preferences
              </p>
            </div>
          </div>
          {/* Previews */}
          <Card className="mb-6">
            <CardContent>
              <div className="space-y-4">
                {/* Branch Name Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Branch Name Preview:</h4>
                  <div className="p-3 bg-muted border rounded font-mono text-sm overflow-x-auto">
                    {generateBranchNamePreview()}
                  </div>
                </div>

                {/* PR Title Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2">PR Title Preview:</h4>
                  <div className="p-3 bg-muted border rounded font-mono text-sm overflow-x-auto">
                    {generatePrTitlePreview()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Settings */}
          <Tabs
            value={activeTab}
            onValueChange={(value: string) => handleTabChange(value as TabValue)}
            className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value={TABS.GLOBAL} className="flex items-center">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Global Settings
              </TabsTrigger>
              <TabsTrigger value={TABS.TEMPLATES} className="flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value={TABS.CATEGORIES} className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Categories
              </TabsTrigger>
            </TabsList>

            {/* Global Settings Section */}
            <TabsContent value={TABS.GLOBAL}>
              <GlobalSettings control={form.control} />
            </TabsContent>

            {/* Templates Section */}
            <TabsContent value={TABS.TEMPLATES}>
              <BranchTemplateSettings
                control={form.control}
                watchTemplates={watchTemplates}
                getValues={form.getValues}
                setValue={form.setValue}
              />
            </TabsContent>

            {/* Categories Section */}
            <TabsContent value={TABS.CATEGORIES}>
              <CategoriesOptions
                watchCategories={watchCategories}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                getValues={form.getValues}
                setValue={form.setValue}
              />
            </TabsContent>

            {/* Reset to defaults */}
            <div className="pt-2 flex justify-end">
              <Button type="button" variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
              </Button>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}

export default OptionsPage
