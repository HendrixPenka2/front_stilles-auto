"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { VehicleCard } from "@/components/vehicles/vehicle-card"
import { VehicleFilters } from "@/components/vehicles/vehicle-filters"
import { Pagination } from "@/components/ui/pagination-custom"
import type { Vehicle, VehicleFilters as VehicleFiltersType } from "@/lib/types"

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    brand: "Mercedes-Benz",
    model: "Classe E",
    year: 2024,
    status: "AVAILABLE",
    type: "RENTAL",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 5,
    doors: 4,
    mileage: 15000,
    color: "Noir",
    pricePerDay: 150000,
    stock: 1,
    description: "Berline luxueuse",
    features: ["GPS", "Climatisation", "Cuir"],
    images: [{ id: "1", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80", isPrimary: true, order: 0 }],
    rating: 4.8,
    reviewCount: 24,
    category: "LUXURY",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    brand: "BMW",
    model: "X5",
    year: 2023,
    status: "AVAILABLE",
    type: "BOTH",
    transmission: "AUTOMATIC",
    fuelType: "HYBRID",
    seats: 7,
    doors: 5,
    mileage: 20000,
    color: "Blanc",
    pricePerDay: 180000,
    salePrice: 45000000,
    stock: 1,
    description: "SUV premium",
    features: ["GPS", "Toit panoramique", "Caméra 360"],
    images: [{ id: "2", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80", isPrimary: true, order: 0 }],
    rating: 4.9,
    reviewCount: 18,
    category: "SUV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    brand: "Porsche",
    model: "911 Carrera",
    year: 2024,
    status: "AVAILABLE",
    type: "RENTAL",
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    seats: 2,
    doors: 2,
    mileage: 5000,
    color: "Rouge",
    pricePerDay: 350000,
    stock: 1,
    description: "Sport de légende",
    features: ["Mode Sport", "Échappement sport"],
    images: [{ id: "3", url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80", isPrimary: true, order: 0 }],
    rating: 5.0,
    reviewCount: 12,
    category: "SPORT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    brand: "Audi",
    model: "Q7",
    year: 2023,
    status: "AVAILABLE",
    type: "SALE_ONLY",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 7,
    doors: 5,
    mileage: 35000,
    color: "Gris",
    salePrice: 38000000,
    stock: 1,
    description: "SUV familial premium",
    features: ["Virtual cockpit", "Bang & Olufsen"],
    images: [{ id: "4", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80", isPrimary: true, order: 0 }],
    rating: 4.7,
    reviewCount: 31,
    category: "SUV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2023,
    status: "AVAILABLE",
    type: "BOTH",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 7,
    doors: 5,
    mileage: 25000,
    color: "Blanc",
    pricePerDay: 200000,
    salePrice: 55000000,
    stock: 1,
    description: "4x4 légendaire",
    features: ["4x4", "Suspension adaptative"],
    images: [{ id: "5", url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80", isPrimary: true, order: 0 }],
    rating: 4.9,
    reviewCount: 45,
    category: "SUV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    brand: "Lexus",
    model: "ES 350",
    year: 2024,
    status: "AVAILABLE",
    type: "RENTAL",
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    seats: 5,
    doors: 4,
    mileage: 8000,
    color: "Argent",
    pricePerDay: 120000,
    stock: 1,
    description: "Élégance japonaise",
    features: ["Mark Levinson Audio", "Sièges ventilés"],
    images: [{ id: "6", url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80", isPrimary: true, order: 0 }],
    rating: 4.6,
    reviewCount: 22,
    category: "LUXURY",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [filters, setFilters] = React.useState<VehicleFiltersType>({})
  const [currentPage, setCurrentPage] = React.useState(1)
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  // Apply URL params as initial filters
  React.useEffect(() => {
    const type = searchParams.get("type")
    const brand = searchParams.get("brand")
    const category = searchParams.get("category")
    
    setFilters({
      type: type as VehicleFiltersType["type"] || undefined,
      brand: brand || undefined,
      category: category || undefined,
    })
  }, [searchParams])

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const clearFilters = () => {
    setFilters({})
  }

  const removeFilter = (key: keyof VehicleFiltersType) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-secondary/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Catalogue Véhicules
          </h1>
          <p className="text-muted-foreground">
            Découvrez notre sélection de véhicules premium disponibles à la location et à la vente.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <VehicleFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtres
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <VehicleFilters filters={filters} onFiltersChange={setFilters} />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-muted-foreground">
                  {mockVehicles.length} véhicules trouvés
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Vue grille</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">Vue liste</span>
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                {filters.type && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.type === "RENTAL" ? "Location" : "Vente"}
                    <button onClick={() => removeFilter("type")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.brand && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.brand}
                    <button onClick={() => removeFilter("brand")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.category}
                    <button onClick={() => removeFilter("category")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer tout
                </Button>
              </div>
            )}

            {/* Vehicles Grid */}
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }>
              {mockVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
