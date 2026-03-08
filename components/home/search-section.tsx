"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, MapPin, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

const vehicleTypes = [
  { value: "all", label: "Tous les types" },
  { value: "RENTAL", label: "Location" },
  { value: "SALE_ONLY", label: "Achat" },
]

const brands = [
  { value: "all", label: "Toutes les marques" },
  { value: "mercedes", label: "Mercedes-Benz" },
  { value: "bmw", label: "BMW" },
  { value: "audi", label: "Audi" },
  { value: "toyota", label: "Toyota" },
  { value: "lexus", label: "Lexus" },
  { value: "porsche", label: "Porsche" },
]

export function SearchSection() {
  const router = useRouter()
  const [searchType, setSearchType] = React.useState("all")
  const [brand, setBrand] = React.useState("all")
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType !== "all") params.set("type", searchType)
    if (brand !== "all") params.set("brand", brand)
    if (startDate) params.set("startDate", format(startDate, "yyyy-MM-dd"))
    if (endDate) params.set("endDate", format(endDate, "yyyy-MM-dd"))
    
    router.push(`/vehicles?${params.toString()}`)
  }

  return (
    <section className="relative -mt-24 z-10 pb-8">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8">
          <div className="flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b pb-4">
              <Button
                variant={searchType === "RENTAL" ? "default" : "ghost"}
                className="rounded-full"
                onClick={() => setSearchType("RENTAL")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Location
              </Button>
              <Button
                variant={searchType === "SALE_ONLY" ? "default" : "ghost"}
                className="rounded-full"
                onClick={() => setSearchType("SALE_ONLY")}
              >
                <Car className="mr-2 h-4 w-4" />
                Achat
              </Button>
            </div>

            {/* Search Fields */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Brand Select */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Marque</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              {searchType === "RENTAL" && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 w-full justify-start rounded-xl text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* End Date */}
              {searchType === "RENTAL" && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 w-full justify-start rounded-xl text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Location (for sale) */}
              {searchType === "SALE_ONLY" && (
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-muted-foreground text-sm">Budget maximum</Label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Ex: 15 000 000 XAF"
                      className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  size="lg" 
                  className="h-12 w-full rounded-xl gap-2"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
