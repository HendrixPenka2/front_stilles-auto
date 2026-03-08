"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { AccessoryFilters as AccessoryFiltersType } from "@/lib/types"

interface AccessoryFiltersProps {
  filters: AccessoryFiltersType
  onFiltersChange: (filters: AccessoryFiltersType) => void
}

const categories = [
  "Intérieur",
  "Électronique",
  "Entretien",
  "Extérieur",
  "Sécurité",
  "Confort",
]

export function AccessoryFilters({ filters, onFiltersChange }: AccessoryFiltersProps) {
  const [priceRange, setPriceRange] = React.useState([0, 200000])
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? category : undefined,
    })
  }

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked || undefined,
    })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({
      ...filters,
      priceMin: value[0] || undefined,
      priceMax: value[1] || undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Rechercher</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Nom de l'accessoire..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <Separator />

      {/* In Stock Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
          En stock uniquement
        </Label>
        <Switch
          id="in-stock"
          checked={filters.inStock || false}
          onCheckedChange={handleInStockChange}
        />
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">
            Catégorie
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category === category}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">
            Prix
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={200000}
                step={5000}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{priceRange[0].toLocaleString()} XAF</span>
                <span>{priceRange[1].toLocaleString()} XAF</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
