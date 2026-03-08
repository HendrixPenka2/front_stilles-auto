"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, Star, Fuel, Settings2, Users, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Vehicle } from "@/lib/types"
import { useAuthStore, useWishlistStore } from "@/lib/stores"
import { toast } from "sonner"

interface VehicleCardProps {
  vehicle: Vehicle
  className?: string
}

const transmissionLabels: Record<string, string> = {
  MANUAL: "Manuelle",
  AUTOMATIC: "Automatique",
}

const fuelLabels: Record<string, string> = {
  GASOLINE: "Essence",
  DIESEL: "Diesel",
  ELECTRIC: "Électrique",
  HYBRID: "Hybride",
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const { isAuthenticated } = useAuthStore()
  const { isInWishlist, addVehicle, removeItem, items } = useWishlistStore()
  const [isLiked, setIsLiked] = React.useState(false)

  React.useEffect(() => {
    setIsLiked(isInWishlist(vehicle.id, "vehicle"))
  }, [vehicle.id, isInWishlist, items])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter aux favoris")
      return
    }

    try {
      if (isLiked) {
        const item = items.find((i) => i.vehicleId === vehicle.id)
        if (item) {
          await removeItem(item.id)
          toast.success("Retiré des favoris")
        }
      } else {
        await addVehicle(vehicle)
        toast.success("Ajouté aux favoris")
      }
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  const primaryImage = vehicle.images?.find((img) => img.isPrimary)?.url || vehicle.images?.[0]?.url || "/placeholder-car.jpg"

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price)
  }

  return (
    <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1", className)}>
      <Link href={`/vehicles/${vehicle.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={primaryImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {vehicle.type === "RENTAL" && (
              <Badge className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="mr-1 h-3 w-3" />
                Location
              </Badge>
            )}
            {vehicle.type === "SALE_ONLY" && (
              <Badge className="bg-emerald-600 hover:bg-emerald-700">
                Vente
              </Badge>
            )}
            {vehicle.type === "BOTH" && (
              <Badge variant="secondary">
                Location & Vente
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
              isLiked && "text-red-500"
            )}
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
            <span className="sr-only">Ajouter aux favoris</span>
          </Button>

          {/* Status Badge */}
          {vehicle.status !== "AVAILABLE" && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-1">
                {vehicle.status === "RENTED" && "En location"}
                {vehicle.status === "MAINTENANCE" && "En maintenance"}
                {vehicle.status === "SOLD" && "Vendu"}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-muted-foreground">{vehicle.year}</p>
            </div>
            {vehicle.rating > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{vehicle.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({vehicle.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Settings2 className="h-4 w-4" />
              {transmissionLabels[vehicle.transmission]}
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              {fuelLabels[vehicle.fuelType]}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {vehicle.seats} places
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-3 border-t">
            {vehicle.pricePerDay && (
              <div>
                <span className="text-2xl font-bold">{formatPrice(vehicle.pricePerDay)}</span>
                <span className="text-sm text-muted-foreground ml-1">XAF/jour</span>
              </div>
            )}
            {vehicle.salePrice && !vehicle.pricePerDay && (
              <div>
                <span className="text-2xl font-bold">{formatPrice(vehicle.salePrice)}</span>
                <span className="text-sm text-muted-foreground ml-1">XAF</span>
              </div>
            )}
            <Button size="sm" className="rounded-full">
              Voir détails
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
