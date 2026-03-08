"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { VehicleFilters as VehicleFiltersType } from "@/lib/types"

interface VehicleFiltersProps {
  filters: VehicleFiltersType
  onFiltersChange: (filters: VehicleFiltersType) => void
}

const brands = [
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Porsche",
  "Toyota",
  "Lexus",
  "Land Rover",
  "Volkswagen",
]

const transmissions = [
  { value: "AUTOMATIC", label: "Automatique" },
  { value: "MANUAL", label: "Manuelle" },
]

const fuelTypes = [
  { value: "GASOLINE", label: "Essence" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Électrique" },
  { value: "HYBRID", label: "Hybride" },
]

const vehicleTypes = [
  { value: "RENTAL", label: "Location" },
  { value: "SALE_ONLY", label: "Vente" },
  { value: "BOTH", label: "Location & Vente" },
]

const categories = [
  "SUV",
  "LUXURY",
  "SPORT",
  "BERLINE",
  "COMPACT",
  "UTILITAIRE",
]

export function VehicleFilters({ filters, onFiltersChange }: VehicleFiltersProps) {
  const [priceRange, setPriceRange] = React.useState([0, 500000])
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      brand: checked ? brand : undefined,
    })
  }

  const handleTypeChange = (type: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      type: checked ? (type as VehicleFiltersType["type"]) : undefined,
    })
  }

  const handleTransmissionChange = (transmission: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      transmission: checked ? (transmission as VehicleFiltersType["transmission"]) : undefined,
    })
  }

  const handleFuelTypeChange = (fuelType: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      fuelType: checked ? (fuelType as VehicleFiltersType["fuelType"]) : undefined,
    })
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? category : undefined,
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
            placeholder="Marque, modèle..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["type", "brand", "price"]} className="w-full">
        {/* Vehicle Type */}
        <AccordionItem value="type">
          <AccordionTrigger className="text-sm font-medium">
            Type de transaction
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {vehicleTypes.map((type) => (
                <div key={type.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.type === type.value}
                    onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                  />
                  <Label
                    htmlFor={`type-${type.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-medium">
            Marque
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brand === brand}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">
            Prix par jour
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={500000}
                step={10000}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{priceRange[0].toLocaleString()} XAF</span>
                <span>{priceRange[1].toLocaleString()} XAF</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Transmission */}
        <AccordionItem value="transmission">
          <AccordionTrigger className="text-sm font-medium">
            Transmission
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {transmissions.map((t) => (
                <div key={t.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`transmission-${t.value}`}
                    checked={filters.transmission === t.value}
                    onCheckedChange={(checked) => handleTransmissionChange(t.value, checked as boolean)}
                  />
                  <Label
                    htmlFor={`transmission-${t.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {t.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fuel Type */}
        <AccordionItem value="fuel">
          <AccordionTrigger className="text-sm font-medium">
            Carburant
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {fuelTypes.map((f) => (
                <div key={f.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`fuel-${f.value}`}
                    checked={filters.fuelType === f.value}
                    onCheckedChange={(checked) => handleFuelTypeChange(f.value, checked as boolean)}
                  />
                  <Label
                    htmlFor={`fuel-${f.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {f.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">
            Catégorie
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${cat}`}
                    checked={filters.category === cat}
                    onCheckedChange={(checked) => handleCategoryChange(cat, checked as boolean)}
                  />
                  <Label
                    htmlFor={`category-${cat}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
