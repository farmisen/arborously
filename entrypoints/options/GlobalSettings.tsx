import { type FC } from "react"
import { type Control } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  findInvalidGitBranchChars,
  hasInvalidGitBranchChars,
  invalidGitBranchChars
} from "@/lib/validation"

import { type FormData } from "./OptionsPage"

type GlobalSettingsProps = {
  control: Control<FormData>
}

const GlobalSettings: FC<GlobalSettingsProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Configure general options for branch generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <FormLabel className="mb-0 w-32 cursor-help">Username</FormLabel>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  This will be used in branch templates with the {`{username} `}
                  placeholder. Must only contain valid Git branch characters.
                </TooltipContent>
              </Tooltip>
              <div className="flex flex-col">
                <FormControl>
                  <Input
                    placeholder="your_user_name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                    }}
                    className={`w-48 ${field.value && hasInvalidGitBranchChars(field.value) ? "border-destructive" : ""}`}
                  />
                </FormControl>
                {field.value && hasInvalidGitBranchChars(field.value) && (
                  <div className="text-destructive text-xs mt-1">
                    {`Contains invalid characters: ${findInvalidGitBranchChars(field.value).join(", ")}`}
                  </div>
                )}
              </div>
              <FormMessage className="absolute right-0 -bottom-5 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="enforceLowercase"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <FormLabel className="mb-0 w-32 cursor-help">
                    Enforce Lowercase
                  </FormLabel>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Convert all branch names to lowercase
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage className="absolute right-0 -bottom-5 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="replacementCharacter"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <FormLabel className="mb-0 w-32 cursor-help">
                    Replacement Character
                  </FormLabel>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Character to use when replacing spaces and invalid characters in
                  branch names. Cannot use spaces or special characters (~^:?*[\].).
                </TooltipContent>
              </Tooltip>
              <div className="flex flex-col">
                <FormControl>
                  <Input
                    {...field}
                    maxLength={1}
                    className={`w-10 text-center ${
                      field.value && invalidGitBranchChars.test(field.value)
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                </FormControl>
                {field.value && invalidGitBranchChars.test(field.value) && (
                  <div className="text-destructive text-xs mt-1">Invalid character</div>
                )}
              </div>
              <FormMessage className="absolute right-0 -bottom-5 text-xs" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default GlobalSettings
