import { zodResolver } from "@hookform/resolvers/zod"
import { Layers, RotateCcw, Save, Settings as SettingsIcon, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateBranchName } from "@/lib/branch-name-generator"
import { DEFAULT_SETTINGS } from "@/lib/constants"
import { getSettingsStorageService } from "@/lib/settings-storage-service"
import { type Settings } from "@/lib/types"
import {
  hasInvalidGitBranchChars,
  hasInvalidPlaceholders,
  invalidGitBranchChars,
  isValidTemplate,
  validPlaceholders
} from "@/lib/validation"

import BranchTemplateSettings from "./BranchTemplateSettings"
import CategoriesOptions from "./CategoriesOptions"
import GlobalSettings from "./GlobalSettings"

const settingsStorageService = getSettingsStorageService()

export const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters."
    })
    .refine((val) => !val || hasInvalidGitBranchChars(val), {
      message: "Username Contains invalid characters."
    })
    .optional()
    .or(z.literal("")),
  templates: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(2, {
          message: "Template name must be at least 2 characters."
        }),
        template: z
          .string()
          .min(1, {
            message: "Template pattern is required."
          })
          .refine(
            (val) => {
              const usedPlaceholders = validPlaceholders.filter((p) => val.includes(p))
              return usedPlaceholders.length > 0
            },
            {
              message:
                "Template must include at least one valid placeholder: {id}, {title}, {category}, {username}"
            }
          )
          .refine((val) => isValidTemplate(val), {
            message: "Template Contains invalid characters."
          })
          .refine((val) => !hasInvalidPlaceholders(val), {
            message: "Template contains invalid placeholders."
          })
      })
    )
    .nonempty({
      message: "At least one template is required."
    })
    // This ensures the array is typed as a non-empty array at the TypeScript level
    .transform(
      (
        val
      ): [
        { id: string; name: string; template: string },
        ...{ id: string; name: string; template: string }[]
      ] => {
        if (val.length === 0) {
          throw new Error("Templates array cannot be empty")
        }
        return val as [
          { id: string; name: string; template: string },
          ...{ id: string; name: string; template: string }[]
        ]
      }
    ),
  defaultTemplate: z.string(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        name: z
          .string()
          .min(2, {
            message: "Category name must be at least 2 characters."
          })
          .refine((val) => hasInvalidGitBranchChars(val), {
            message: "Category name Contains invalid characters."
          })
      })
    )
    .nonempty({
      message: "At least one category is required."
    })
    // This ensures the array is typed as a non-empty array at the TypeScript level
    .transform(
      (val): [{ id: string; name: string }, ...{ id: string; name: string }[]] => {
        if (val.length === 0) {
          throw new Error("Categories array cannot be empty")
        }
        return val as [{ id: string; name: string }, ...{ id: string; name: string }[]]
      }
    ),
  defaultCategory: z.string(),
  enforceLowercase: z.boolean(),
  replacementCharacter: z
    .string()
    .max(1, {
      message: "Replacement character must be a single character."
    })
    .refine((val) => val && !invalidGitBranchChars.test(val), {
      message:
        "Invalid character. Cannot use spaces, ~, ^, :, ?, *, [, \\, or dots (.)."
    })
})

export type FormData = z.infer<typeof formSchema>

const OptionsPage = () => {
  const [newTemplate, setNewTemplate] = useState({ name: "", template: "" })
  const [newCategory, setNewCategory] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [previewData, setPreviewData] = useState({
    id: "TASK-123",
    title: "Add new feature",
    category: "feat",
    username: "your_user_name"
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_SETTINGS
  })

  // Load settings from storage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsStorageService.get()
        form.reset(settings)
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

  const watchTemplates = form.watch("templates")
  const watchDefaultTemplate = form.watch("defaultTemplate")
  const watchCategories = form.watch("categories")
  const watchDefaultCategory = form.watch("defaultCategory")
  const watchEnforceLowercase = form.watch("enforceLowercase")
  const watchReplacementCharacter = form.watch("replacementCharacter")
  const watchUsername = form.watch("username")

  const generatePreview = () => {
    const selectedTemplate = watchTemplates.find((t) => t.id === watchDefaultTemplate)
    if (!selectedTemplate) return ""

    const selectedCategory = watchCategories.find((c) => c.id === watchDefaultCategory)
    const categoryName = selectedCategory ? selectedCategory.name : previewData.category

    try {
      return generateBranchName(
        selectedTemplate.template,
        {
          id: previewData.id,
          title: previewData.title,
          category: categoryName
        },
        watchUsername && watchUsername.length > 0
          ? watchUsername
          : previewData.username,
        {
          lower: watchEnforceLowercase,
          replacement: watchReplacementCharacter
        }
      )
    } catch (error) {
      console.error("Error generating branch name:", error)
      return "Invalid template configuration"
    }
  }

  const resetToDefaults = () => {
    void settingsStorageService.reset()
    form.reset(DEFAULT_SETTINGS)
    toast.info("All settings have been reset to default values.", {
      duration: 3000
    })
  }

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    try {
      await settingsStorageService.set(data as Settings)
      toast.success("Your settings have been successfully saved.", {
        duration: 3000
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to save settings. Please try again.", {
        duration: 5000
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Arborously Options</h1>
              <p className="text-muted-foreground">
                Configure your branch naming preferences
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const loadSavedSettings = async () => {
                    try {
                      const settings = await settingsStorageService.get()
                      form.reset(settings)
                      toast.info("Changes discarded. Form reset to saved settings.", {
                        duration: 3000
                      })
                    } catch (error) {
                      console.error("Failed to load settings:", error)
                      toast.error("Failed to load settings. Please try again.", {
                        duration: 5000
                      })
                    }
                  }
                  void loadSavedSettings()
                }}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isValid || isSaving}>
                <Save className="h-4 w-4 mr-2" /> Save Settings
              </Button>
            </div>
          </div>

          {/* Branch Name Preview */}
          <Card className="mb-6">
            <CardContent>
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2">Branch Name Preview:</h4>
                <div className="p-3 bg-muted border rounded font-mono text-sm overflow-x-auto">
                  {generatePreview()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Tabs defaultValue="global-settings" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="global-settings" className="flex items-center">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Global Settings
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Branch Templates
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Categories
              </TabsTrigger>
            </TabsList>

            {/* Global Settings Section */}
            <TabsContent value="global-settings">
              <GlobalSettings control={form.control} />
            </TabsContent>

            {/* Branch Templates Section */}
            <TabsContent value="templates">
              <BranchTemplateSettings
                control={form.control}
                watchTemplates={watchTemplates}
                watchDefaultTemplate={watchDefaultTemplate}
                newTemplate={newTemplate}
                setNewTemplate={setNewTemplate}
                getValues={form.getValues}
                setValue={form.setValue}
              />
            </TabsContent>

            {/* Categories Section */}
            <TabsContent value="categories">
              <CategoriesOptions
                watchCategories={watchCategories}
                watchDefaultCategory={watchDefaultCategory}
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
