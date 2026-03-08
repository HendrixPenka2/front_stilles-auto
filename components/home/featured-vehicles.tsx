"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VehicleCard } from "@/components/vehicles/vehicle-card"
import type { Vehicle } from "@/lib/types"

// Mock data for demo - in production this comes from API
const mockFeaturedVehicles: Vehicle[] = [
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
    features: ["Mode Sport", "Échappement sport", "Jantes 20\""],
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
    features: ["Virtual cockpit", "Système audio Bang & Olufsen", "Hayon électrique"],
    images: [{ id: "4", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80", isPrimary: true, order: 0 }],
    rating: 4.7,
    reviewCount: 31,
    category: "SUV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function FeaturedVehicles() {
  const [vehicles] = React.useState<Vehicle[]>(mockFeaturedVehicles)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Véhicules en Vedette
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Découvrez notre sélection de véhicules premium, soigneusement choisis pour vous offrir une expérience de conduite exceptionnelle.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Précédent</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Suivant</span>
            </Button>
            <Button variant="ghost" className="hidden md:flex gap-2" asChild>
              <Link href="/vehicles">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Vehicles Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex-none w-[320px] md:w-[360px] snap-start">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 text-center md:hidden">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/vehicles">
              Voir tous les véhicules
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
