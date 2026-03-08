"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Car,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { useCartStore } from "@/lib/stores"
import type { CartItem } from "@/lib/types"

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getItemTotal(item: CartItem): number {
  if (item.type === "RENTAL") {
    const start = item.startDate ? new Date(item.startDate) : null
    const end = item.endDate ? new Date(item.endDate) : null
    const days = start && end ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) : 1
    return (item.pricePerUnit || item.vehicle?.pricePerDay || 0) * days
  }
  return (item.pricePerUnit || item.accessory?.price || 0) * item.quantity
}

export default function CartPage() {
  const { localCart: items, updateItem, removeFromLocalCart, clearLocalCart } = useCartStore()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const vehicleItems = items.filter((i) => i.type === "RENTAL")
  const vehiclePurchaseItems = items.filter((i) => i.type === "PURCHASE" && i.vehicleId)
  const accessoryItems = items.filter((i) => i.type === "PURCHASE" && i.accessoryId)

  const subtotal = items.reduce((acc, item) => acc + getItemTotal(item), 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const taxes = (subtotal - discount) * 0.1925 // TVA Cameroun
  const total = subtotal - discount + taxes

  const updateAccessoryQuantity = (id: string, delta: number) => {
    const current = items.find((item) => item.id === id)
    if (!current) return
    const nextQuantity = Math.max(1, current.quantity + delta)
    updateItem(id, { quantity: nextQuantity })
  }

  const removeItem = (id: string) => {
    removeFromLocalCart(id)
  }

  const updateRentalDates = (id: string, startDate: string, endDate: string) => {
    if (!startDate || !endDate) return
    updateItem(id, { startDate, endDate })
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "stilles10") {
      setPromoApplied(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground text-center mb-6">
              Parcourez notre catalogue et ajoutez des articles à votre panier
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/vehicles">
                  <Car className="w-4 h-4 mr-2" />
                  Louer un véhicule
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/accessories">
                  <Package className="w-4 h-4 mr-2" />
                  Voir accessoires
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingCart className="w-7 h-7" />
        Mon panier
        <Badge variant="secondary">{items.length} article{items.length > 1 ? "s" : ""}</Badge>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Rentals */}
          {vehicleItems.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="w-5 h-5" />
                  Locations de véhicules ({vehicleItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-secondary/30"
                  >
                    <div className="relative w-full md:w-40 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.vehicle?.images?.[0]?.url || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop"}
                        alt={item.vehicle ? `${item.vehicle.brand} ${item.vehicle.model}` : "Véhicule"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {item.vehicle?.category || "Véhicule"}
                          </Badge>
                          <h3 className="font-semibold text-lg">{item.vehicle ? `${item.vehicle.brand} ${item.vehicle.model}` : item.vehicleId}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.startDate ? formatDate(item.startDate) : "-"} - {item.endDate ? formatDate(item.endDate) : "-"}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Cameroun
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={item.startDate || ""}
                          onChange={(e) => updateRentalDates(item.id, e.target.value, item.endDate || e.target.value)}
                        />
                        <Input
                          type="date"
                          value={item.endDate || ""}
                          onChange={(e) => updateRentalDates(item.id, item.startDate || e.target.value, e.target.value)}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            {formatPrice(item.pricePerUnit || item.vehicle?.pricePerDay || 0)}/jour
                          </span>
                        </div>
                        <span className="text-lg font-bold">
                          {formatPrice(getItemTotal(item))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Accessories */}
          {vehiclePurchaseItems.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="w-5 h-5" />
                  Achats de véhicules ({vehiclePurchaseItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehiclePurchaseItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.vehicle?.images?.[0]?.url || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop"}
                        alt={item.vehicle ? `${item.vehicle.brand} ${item.vehicle.model}` : "Véhicule"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="mb-1">Vente véhicule</Badge>
                      <h3 className="font-medium truncate">{item.vehicle ? `${item.vehicle.brand} ${item.vehicle.model}` : item.vehicleId}</h3>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.pricePerUnit)} / unité</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold">{formatPrice(getItemTotal(item))}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-auto p-0"
                        onClick={() => removeItem(item.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Accessories */}
          {accessoryItems.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5" />
                  Accessoires ({accessoryItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {accessoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.accessory?.images?.[0] || "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop"}
                        alt={item.accessory?.name || "Accessoire"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="mb-1">
                        {item.accessory?.category || "Accessoire"}
                      </Badge>
                      <h3 className="font-medium truncate">{item.accessory?.name || item.accessoryId}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.pricePerUnit || item.accessory?.price || 0)} / unité
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateAccessoryQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateAccessoryQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold">{formatPrice(getItemTotal(item))}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-auto p-0"
                        onClick={() => removeItem(item.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Promo Code */}
              <div className="flex gap-2">
                <Input
                  placeholder="Code promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <Button
                  variant="outline"
                  onClick={applyPromoCode}
                  disabled={promoApplied || !promoCode}
                >
                  Appliquer
                </Button>
              </div>

              {promoApplied && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <AlertCircle className="w-4 h-4" />
                  Code promo STILLES10 appliqué (-10%)
                </div>
              )}

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-success">
                    <span>Réduction</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA (19.25%)</span>
                  <span>{formatPrice(taxes)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Passer la commande
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full" onClick={clearLocalCart}>
                Vider le panier
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                En passant commande, vous acceptez nos conditions générales de vente
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
