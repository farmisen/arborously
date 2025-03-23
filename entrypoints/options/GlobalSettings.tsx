import { ChevronDown } from "lucide-react"
import { type FC, useState } from "react"
import { type Control } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { type FormData } from "./OptionsPage"

type GlobalSettingsProps = {
  control: Control<FormData>
}

// Define common replacement characters
const REPLACEMENT_CHARACTERS = [
  { value: "-", label: "Dash (-)" },
  { value: "_", label: "Underscore (_)" }
]

const GlobalSettings: FC<GlobalSettingsProps> = ({ control }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FormLabel className="mb-0 w-32 cursor-help">Username</FormLabel>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    This will be used in branch templates with the {`{username} `}
                    placeholder.
                  </TooltipContent>
                </Tooltip>
                <FormControl>
                  <Input placeholder="your_user_name" {...field} className="w-48" />
                </FormControl>
              </div>
              <div className="ml-36 -mt-1">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="enforceLowercase"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-4">
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
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <div className="ml-36 -mt-1">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="replacementCharacter"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FormLabel className="mb-0 w-32 cursor-help">
                      Replacement Character
                    </FormLabel>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Character to use when replacing spaces and invalid characters in
                    branch names. Choose the character you prefer for readable branch
                    names.
                  </TooltipContent>
                </Tooltip>
                <FormControl>
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-32 justify-between"
                        aria-label="Select a replacement character">
                        {field.value || "Select..."}{" "}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {REPLACEMENT_CHARACTERS.map((char) => (
                        <DropdownMenuItem
                          key={char.value}
                          onClick={() => {
                            field.onChange(char.value)
                            setDropdownOpen(false)
                          }}
                          className={field.value === char.value ? "bg-accent" : ""}>
                          {char.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
              </div>
              <div className="ml-36 -mt-1">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default GlobalSettings
