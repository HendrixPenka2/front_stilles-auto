"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, Star, ShoppingCart, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Accessory } from "@/lib/types"
import { useAuthStore, useCartStore } from "@/lib/stores"
import { toast } from "sonner"

interface AccessoryCardProps {
  accessory: Accessory
  className?: string
}

export function AccessoryCard({ accessory, className }: AccessoryCardProps) {
  const { isAuthenticated } = useAuthStore()
  const { addToLocalCart } = useCartStore()
  const [isLiked, setIsLiked] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter aux favoris")
      return
    }
    setIsLiked(!isLiked)
    toast.success(isLiked ? "Retiré des favoris" : "Ajouté aux favoris")
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!accessory.inStock) {
      toast.error("Cet article est en rupture de stock")
      return
    }

    setIsAdding(true)
    try {
      addToLocalCart({
        id: `local-${accessory.id}-${Date.now()}`,
        type: "PURCHASE",
        accessoryId: accessory.id,
        accessory: accessory,
        quantity: 1,
        pricePerUnit: accessory.price,
        totalPrice: accessory.price,
      })
      toast.success("Ajouté au panier")
    } catch {
      toast.error("Erreur lors de l'ajout au panier")
    } finally {
      setIsAdding(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price)
  }

  return (
    <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1", className)}>
      <Link href={`/accessories/${accessory.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <img
            src={accessory.images[0]}
            alt={accessory.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Stock Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={accessory.inStock ? "default" : "destructive"}
              className={cn(
                accessory.inStock 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : ""
              )}
            >
              {accessory.inStock ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  En stock
                </>
              ) : (
                <>
                  <X className="mr-1 h-3 w-3" />
                  Rupture
                </>
              )}
            </Badge>
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

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {accessory.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title & Rating */}
          <div className="mb-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">
              {accessory.name}
            </h3>
            {accessory.rating > 0 && (
              <div className="flex items-center gap-1 text-sm mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{accessory.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({accessory.reviewCount} avis)</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {accessory.description}
          </p>

          {/* Price & CTA */}
          <div className="flex items-end justify-between pt-3 border-t">
            <div>
              <span className="text-2xl font-bold">{formatPrice(accessory.price)}</span>
              <span className="text-sm text-muted-foreground ml-1">XAF</span>
            </div>
            <Button 
              size="sm" 
              className="rounded-full gap-2"
              disabled={!accessory.inStock || isAdding}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {isAdding ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
