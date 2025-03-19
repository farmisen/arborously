import { Check, Plus, Trash2 } from "lucide-react"
import { type Dispatch, type FC, type SetStateAction } from "react"
import { type UseFormGetValues, type UseFormSetValue } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { type Category, type NonEmptyCategoryArray } from "@/lib/types"
import { findInvalidGitBranchChars, hasInvalidGitBranchChars } from "@/lib/validation"

import { type FormData } from "./OptionsPage"

type CategoriesSettingsProps = {
  watchCategories: Category[]
  watchDefaultCategoryId: string
  newCategory: string
  setNewCategory: Dispatch<SetStateAction<string>>
  getValues: UseFormGetValues<FormData>
  setValue: UseFormSetValue<FormData>
}

const CategoriesSettings: FC<CategoriesSettingsProps> = ({
  watchCategories,
  watchDefaultCategoryId,
  newCategory,
  setNewCategory,
  getValues,
  setValue
}) => {
  const addCategory = () => {
    if (newCategory) {
      const categories = getValues("categories")
      const newId = (
        Math.max(...categories.map((c) => Number.parseInt(c.id)), 0) + 1
      ).toString()
      setValue("categories", [...categories, { id: newId, name: newCategory }], {
        shouldDirty: true,
        shouldTouch: true
      })
      setNewCategory("")
    }
  }

  const removeCategory = (id: string) => {
    const categories = getValues("categories")
    const filteredCategories = categories.filter((c) => c.id !== id)
    // Casting is safe because the UI disables removal when categories.length <= 1
    setValue("categories", filteredCategories as NonEmptyCategoryArray, {
      shouldDirty: true,
      shouldTouch: true
    })

    // If the default category is removed, set a new default
    if (getValues("defaultCategoryId") === id && categories.length > 1) {
      setValue("defaultCategoryId", filteredCategories[0].id, {
        shouldDirty: true,
        shouldTouch: true
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Create and manage categories for your branches (feat, bug, chore, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Your Categories</h3>
          <div className="flex flex-wrap gap-2">
            {watchCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 p-2 border rounded-md">
                <Badge variant="outline">{category.name}</Badge>
                <Button
                  type="button"
                  variant={
                    watchDefaultCategoryId === category.id ? "secondary" : "outline"
                  }
                  size="sm"
                  className="h-7 px-2"
                  onClick={() =>
                    setValue("defaultCategoryId", category.id, {
                      shouldDirty: true,
                      shouldTouch: true
                    })
                  }>
                  {watchDefaultCategoryId === category.id && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  Default
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeCategory(category.id)}
                  disabled={watchCategories.length <= 1}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Category */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Add New Category</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value)
                }}
                placeholder="e.g., feat, bug, chore"
                className={
                  newCategory && hasInvalidGitBranchChars(newCategory)
                    ? "border-destructive"
                    : ""
                }
              />
              <Button
                type="button"
                onClick={addCategory}
                disabled={!newCategory || hasInvalidGitBranchChars(newCategory)}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            {newCategory && hasInvalidGitBranchChars(newCategory) && (
              <div className="text-destructive text-xs">
                {`Contains invalid characters: ${findInvalidGitBranchChars(newCategory).join(", ")}`}
              </div>
            )}
            <div className="text-muted-foreground text-xs">
              Categories must only contain valid Git branch characters
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CategoriesSettings
