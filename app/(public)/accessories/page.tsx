"use client"

import * as React from "react"
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
import { AccessoryCard } from "@/components/accessories/accessory-card"
import { AccessoryFilters } from "@/components/accessories/accessory-filters"
import { Pagination } from "@/components/ui/pagination-custom"
import type { Accessory, AccessoryFilters as AccessoryFiltersType } from "@/lib/types"

// Mock data
const mockAccessories: Accessory[] = [
  {
    id: "1",
    name: "Tapis de sol premium Mercedes",
    description: "Tapis de sol haut de gamme en velours pour Mercedes Classe E",
    category: "Intérieur",
    price: 85000,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80"],
    compatibleVehicles: ["Mercedes-Benz Classe E", "Mercedes-Benz Classe C"],
    specifications: { material: "Velours", color: "Noir" },
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Chargeur sans fil Qi",
    description: "Chargeur sans fil universel pour smartphone, compatible avec tous les véhicules",
    category: "Électronique",
    price: 45000,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"],
    specifications: { power: "15W", compatibility: "Qi" },
    rating: 4.5,
    reviewCount: 78,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Housse de siège cuir synthétique",
    description: "Housse de protection premium pour sièges avant, aspect cuir véritable",
    category: "Intérieur",
    price: 120000,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80"],
    specifications: { material: "Cuir synthétique", seats: "2" },
    rating: 4.6,
    reviewCount: 35,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Dashcam Full HD",
    description: "Caméra embarquée Full HD 1080p avec vision nocturne et détection de mouvement",
    category: "Électronique",
    price: 75000,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"],
    specifications: { resolution: "1080p", storage: "128GB" },
    rating: 4.7,
    reviewCount: 56,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Kit de nettoyage complet",
    description: "Kit professionnel de nettoyage intérieur et extérieur pour votre véhicule",
    category: "Entretien",
    price: 35000,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80"],
    specifications: { pieces: "12", type: "Professionnel" },
    rating: 4.4,
    reviewCount: 89,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Support smartphone magnétique",
    description: "Support magnétique ultra-puissant pour grille d'aération",
    category: "Électronique",
    price: 15000,
    stock: 0,
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"],
    specifications: { type: "Magnétique", mounting: "Grille" },
    rating: 4.3,
    reviewCount: 124,
    inStock: false,
    createdAt: new Date().toISOString(),
  },
]

export default function AccessoriesPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [filters, setFilters] = React.useState<AccessoryFiltersType>({})
  const [currentPage, setCurrentPage] = React.useState(1)
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const clearFilters = () => {
    setFilters({})
  }

  const removeFilter = (key: keyof AccessoryFiltersType) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-secondary/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Accessoires Automobiles
          </h1>
          <p className="text-muted-foreground">
            Équipez votre véhicule avec nos accessoires premium pour plus de confort et de style.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <AccessoryFilters filters={filters} onFiltersChange={setFilters} />
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
                      <AccessoryFilters filters={filters} onFiltersChange={setFilters} />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-muted-foreground">
                  {mockAccessories.length} accessoires trouvés
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
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.category}
                    <button onClick={() => removeFilter("category")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="secondary" className="gap-1">
                    En stock
                    <button onClick={() => removeFilter("inStock")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer tout
                </Button>
              </div>
            )}

            {/* Accessories Grid */}
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }>
              {mockAccessories.map((accessory) => (
                <AccessoryCard key={accessory.id} accessory={accessory} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={3}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
