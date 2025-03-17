import { Check, Plus, Trash2 } from "lucide-react"
import { type Dispatch, type FC, type SetStateAction } from "react"
import {
  type Control,
  type UseFormGetValues,
  type UseFormSetValue
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { type NonEmptyTemplateArray, type Template } from "@/lib/types"
import {
  findInvalidGitBranchChars,
  findInvalidPlaceholders,
  findInvalidTemplateChars,
  hasInvalidGitBranchChars,
  hasInvalidPlaceholders,
  isValidTemplate,
  validPlaceholders
} from "@/lib/validation"

import { type FormData } from "./OptionsPage"

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
  const addTemplate = () => {
    if (newTemplate.name && newTemplate.template) {
      const templates = getValues("templates")
      const newId = (
        Math.max(...templates.map((t) => Number.parseInt(t.id)), 0) + 1
      ).toString()
      setValue("templates", [
        ...templates,
        { id: newId, name: newTemplate.name, template: newTemplate.template }
      ])
      setNewTemplate({ name: "", template: "" })
    }
  }

  const removeTemplate = (id: string) => {
    const templates = getValues("templates")
    const filteredTemplates = templates.filter((t) => t.id !== id)
    // Casting is safe because we disable the remove button when only one template remains
    setValue("templates", filteredTemplates as NonEmptyTemplateArray)

    // If the default template is removed, set a new default
    if (getValues("defaultTemplateId") === id && templates.length > 1) {
      setValue("defaultTemplateId", filteredTemplates[0].id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Create and manage your branch naming templates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Your Templates</h3>
          <div className="space-y-2">
            {watchTemplates.map((template) => (
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
                    onClick={() => setValue("defaultTemplateId", template.id)}>
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
            ))}
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
                className={
                  newTemplate.name && hasInvalidGitBranchChars(newTemplate.name)
                    ? "border-destructive"
                    : ""
                }
              />
              {newTemplate.name && hasInvalidGitBranchChars(newTemplate.name) && (
                <div className="text-destructive text-xs mt-1">
                  Contains invalid characters:{" "}
                  {`Contains invalid characters:${findInvalidGitBranchChars(newTemplate.name).join(", ")}`}
                </div>
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
                className={
                  newTemplate.template && !isValidTemplate(newTemplate.template)
                    ? "border-destructive"
                    : ""
                }
              />
              {newTemplate.template &&
                !validPlaceholders.some((p) => newTemplate.template.includes(p)) && (
                  <div className="text-destructive text-xs mt-1">
                    {
                      "Must include at least one placeholder: {id}, {title}, {category}, {username}"
                    }
                  </div>
                )}
              {newTemplate.template &&
                validPlaceholders.some((p) => newTemplate.template.includes(p)) &&
                !isValidTemplate(newTemplate.template) && (
                  <div className="text-destructive text-xs mt-1">
                    {`Contains invalid characters: ${findInvalidTemplateChars(newTemplate.template).join(", ")}`}
                  </div>
                )}
              {newTemplate.template && hasInvalidPlaceholders(newTemplate.template) && (
                <div className="text-destructive text-xs mt-1">
                  {`Contains invalid placeholders:${findInvalidPlaceholders(newTemplate.template).join(", ")}`}
                </div>
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
              hasInvalidGitBranchChars(newTemplate.name) ||
              !isValidTemplate(newTemplate.template) ||
              !validPlaceholders.some((p) => newTemplate.template.includes(p)) ||
              hasInvalidPlaceholders(newTemplate.template)
            }>
            <Plus className="h-4 w-4 mr-2" /> Add Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BranchTemplatesSettings
