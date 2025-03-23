import { Check, Plus, Trash2 } from "lucide-react"
import { type Dispatch, type FC, type SetStateAction, useEffect, useState } from "react"
import {
  type Control,
  type UseFormGetValues,
  type UseFormSetValue
} from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { type NonEmptyTemplateArray, type Template } from "@/lib/types"

import { type FormData, templateSchema } from "./OptionsPage"

type BranchTemplatesSettingsProps = {
  control: Control<FormData>
  watchTemplates: Template[]
  watchDefaultTemplateId: string
  newTemplate: { name: string; template: string }
  setNewTemplate: Dispatch<SetStateAction<{ name: string; template: string }>>
  getValues: UseFormGetValues<FormData>
  setValue: UseFormSetValue<FormData>
}

const BranchTemplatesSettings: FC<BranchTemplatesSettingsProps> = ({
  watchTemplates,
  watchDefaultTemplateId,
  newTemplate,
  setNewTemplate,
  getValues,
  setValue
}) => {
  const [nameError, setNameError] = useState<string | null>(null)
  const [templateError, setTemplateError] = useState<string | null>(null)

  useEffect(() => {
    if (newTemplate.name) {
      try {
        templateSchema.shape.name.parse(newTemplate.name)
        setNameError(null)
      } catch (error) {
        if (error instanceof z.ZodError) {
          setNameError(error.errors[0]?.message || "Invalid template name")
        }
      }
    }

    if (newTemplate.template) {
      try {
        templateSchema.shape.template.parse(newTemplate.template)
        setTemplateError(null)
      } catch (error) {
        if (error instanceof z.ZodError) {
          setTemplateError(error.errors[0]?.message || "Invalid template pattern")
        }
      }
    } else {
      setTemplateError(null)
    }
  }, [newTemplate.name, newTemplate.template])

  const addTemplate = () => {
    if (newTemplate.name && newTemplate.template && !nameError && !templateError) {
      const templates = getValues("templates") as NonEmptyTemplateArray
      const newId = (
        Math.max(...templates.map((t) => Number.parseInt(t.id)), 0) + 1
      ).toString()

      // Use setValue with shouldDirty and shouldTouch to trigger form validation and auto-save
      setValue(
        "templates",
        [
          ...templates,
          { id: newId, name: newTemplate.name, template: newTemplate.template }
        ],
        { shouldDirty: true, shouldTouch: true }
      )

      setNewTemplate({ name: "", template: "" })
    }
  }

  const removeTemplate = (id: string) => {
    const templates = getValues("templates") as NonEmptyTemplateArray
    const filteredTemplates = templates.filter((t) => t.id !== id)
    // Casting is safe because we disable the remove button when only one template remains
    setValue("templates", filteredTemplates as NonEmptyTemplateArray, {
      shouldDirty: true,
      shouldTouch: true
    })

    // If the default template is removed, set a new default
    if (getValues("defaultTemplateId") === id && templates.length > 1) {
      setValue("defaultTemplateId", filteredTemplates[0].id, {
        shouldDirty: true,
        shouldTouch: true
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Create and manage your branch naming templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Your Templates</h3>
          <div className="space-y-2">
            {watchTemplates.map((template) => {
              return (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 border rounded-md">
                  <div className="space-y-1">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {template.template}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={
                        watchDefaultTemplateId === template.id ? "secondary" : "outline"
                      }
                      size="sm"
                      className="h-8"
                      onClick={() =>
                        setValue("defaultTemplateId", template.id, {
                          shouldDirty: true,
                          shouldTouch: true
                        })
                      }>
                      {watchDefaultTemplateId === template.id && (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Default
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTemplate(template.id)}
                      disabled={watchTemplates.length <= 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Add New Template */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Add New Template</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="new-template-name" className="text-sm font-medium">
                Template Name
              </label>
              <Input
                id="new-template-name"
                value={newTemplate.name}
                onChange={(e) => {
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }}
                placeholder="e.g., Feature Branch"
                className={nameError ? "border-destructive" : ""}
              />
              {nameError && (
                <div className="text-destructive text-xs mt-1">{nameError}</div>
              )}
            </div>
            <div>
              <label htmlFor="new-template-pattern" className="text-sm font-medium">
                Template Pattern
              </label>
              <Input
                id="new-template-pattern"
                value={newTemplate.template}
                onChange={(e) => {
                  setNewTemplate({ ...newTemplate, template: e.target.value })
                }}
                placeholder="e.g., {category}/{id}-{title}"
                className={templateError ? "border-destructive" : ""}
              />
              {templateError && (
                <div className="text-destructive text-xs mt-1">{templateError}</div>
              )}
              <div className="text-muted-foreground text-xs mt-1">
                {"Valid placeholders: {id}, {title}, {category}, {username}"}
              </div>
            </div>
          </div>
          <Button
            type="button"
            onClick={addTemplate}
            disabled={
              !newTemplate.name ||
              !newTemplate.template ||
              nameError !== null ||
              templateError !== null
            }>
            <Plus className="h-4 w-4 mr-2" /> Add Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BranchTemplatesSettings
