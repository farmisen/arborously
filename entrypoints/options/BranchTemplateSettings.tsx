import { type FC, useState } from "react"
import {
  type Control,
  type UseFormGetValues,
  type UseFormSetValue
} from "react-hook-form"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Templates } from "@/lib/types"

import {
  type FormData,
  branchNameTemplateSchema,
  prTitleTemplateSchema
} from "./OptionsPage"

type TemplatesSettingsProps = {
  control: Control<FormData>
  watchTemplates: Templates
  getValues: UseFormGetValues<FormData>
  setValue: UseFormSetValue<FormData>
}

const TemplatesSettings: FC<TemplatesSettingsProps> = ({
  watchTemplates,
  setValue
}) => {
  const [branchNameError, setBranchNameError] = useState<string | null>(null)
  const [prTitleError, setPrTitleError] = useState<string | null>(null)

  const validateBranchNameTemplate = (
    template: string,
    setter: (error: string | null) => void
  ) => {
    try {
      branchNameTemplateSchema.parse(template)
      setter(null)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setter(error.errors[0]?.message || "Invalid branch template pattern")
        return false
      }
      return false
    }
  }

  const validatePrTitleTemplate = (
    template: string,
    setter: (error: string | null) => void
  ) => {
    try {
      prTitleTemplateSchema.parse(template)
      setter(null)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setter(error.errors[0]?.message || "Invalid PR title template pattern")
        return false
      }
      return false
    }
  }

  const handleBranchNameChange = (value: string) => {
    validateBranchNameTemplate(value, setBranchNameError)
    setValue("templates.branchName", value, {
      shouldDirty: true,
      shouldTouch: true
    })
  }

  const handlePrTitleChange = (value: string) => {
    validatePrTitleTemplate(value, setPrTitleError)
    setValue("templates.prTitle", value, {
      shouldDirty: true,
      shouldTouch: true
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Configure your branch name and PR title templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="branch-name-template" className="text-sm font-medium">
              Branch Name Template
            </Label>
            <Input
              id="branch-name-template"
              value={watchTemplates.branchName}
              onChange={(e) => handleBranchNameChange(e.target.value)}
              className={branchNameError ? "border-destructive" : ""}
            />
            {branchNameError && (
              <div className="text-destructive text-xs mt-1">{branchNameError}</div>
            )}
            <div className="text-muted-foreground text-xs mt-1">
              {"Valid placeholders: {id}, {title}, {category}, {username}"}
            </div>
          </div>

          <div>
            <Label htmlFor="pr-title-template" className="text-sm font-medium">
              PR Title Template
            </Label>
            <Input
              id="pr-title-template"
              value={watchTemplates.prTitle}
              onChange={(e) => handlePrTitleChange(e.target.value)}
              className={prTitleError ? "border-destructive" : ""}
            />
            {prTitleError && (
              <div className="text-destructive text-xs mt-1">{prTitleError}</div>
            )}
            <div className="text-muted-foreground text-xs mt-1">
              {"Valid placeholders: {id}, {title}, {category}, {username}"}
              <br />
              {
                "You can capitalize the first letter of a placeholder to capitalize the final value (e.g., {Title} vs {title})"
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TemplatesSettings
