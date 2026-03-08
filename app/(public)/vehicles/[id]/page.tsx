"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  Star,
  Fuel,
  Settings2,
  Users,
  DoorOpen,
  Gauge,
  Calendar,
  Check,
  ShoppingCart
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAuthStore, useCartStore } from "@/lib/stores"
import { toast } from "sonner"
import type { Vehicle, Review } from "@/lib/types"

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    brand: "Mercedes-Benz",
    model: "Classe E 300",
    year: 2024,
    vin: "WDB2110541A123456",
    status: "AVAILABLE",
    type: "RENTAL",
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    seats: 5,
    doors: 4,
    mileage: 15000,
    color: "Noir Obsidienne",
    pricePerDay: 150000,
    stock: 1,
    description: "Berline premium idéale pour les déplacements d'affaires.",
    features: ["GPS", "Climatisation", "Caméra 360°"],
    images: [{ id: "1", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80", isPrimary: true, order: 0 }],
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
    description: "SUV premium disponible à la location et à la vente.",
    features: ["GPS", "Toit panoramique", "Caméra 360"],
    images: [{ id: "2", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80", isPrimary: true, order: 0 }],
    rating: 4.9,
    reviewCount: 18,
    category: "SUV",
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
    description: "SUV familial premium uniquement à la vente.",
    features: ["Virtual Cockpit", "Audio premium"],
    images: [{ id: "4", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80", isPrimary: true, order: 0 }],
    rating: 4.7,
    reviewCount: 31,
    category: "SUV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock reviews
const mockReviews: Review[] = [
  {
    id: "1",
    userId: "u1",
    user: { id: "u1", firstName: "Jean", lastName: "Dupont" },
    vehicleId: "1",
    rating: 5,
    comment: "Véhicule exceptionnel ! Très confortable et le service était impeccable. Je recommande vivement.",
    status: "APPROVED",
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "u2",
    user: { id: "u2", firstName: "Marie", lastName: "Martin" },
    vehicleId: "1",
    rating: 4,
    comment: "Très belle voiture, parfaite pour un voyage en famille. Un peu de retard à la livraison mais sinon tout était parfait.",
    status: "APPROVED",
    createdAt: "2024-02-10T14:30:00Z",
  },
]

// Blocked dates (example)
const blockedDates = [
  new Date(2026, 2, 10),
  new Date(2026, 2, 11),
  new Date(2026, 2, 12),
  new Date(2026, 2, 20),
  new Date(2026, 2, 21),
]

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

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>()
  const { isAuthenticated, user } = useAuthStore()
  const { addToLocalCart } = useCartStore()

  const [vehicle] = React.useState<Vehicle>(
    mockVehicles.find((item) => item.id === params.id) || mockVehicles[0]
  )
  const [purchaseMode, setPurchaseMode] = React.useState<"RENTAL" | "PURCHASE">(
    vehicle.type === "SALE_ONLY" ? "PURCHASE" : "RENTAL"
  )
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [isLiked, setIsLiked] = React.useState(false)
  const [isBooking, setIsBooking] = React.useState(false)
  const [reviews, setReviews] = React.useState<Review[]>(mockReviews)
  const [newReview, setNewReview] = React.useState("")
  const [newRating, setNewRating] = React.useState(5)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price)
  }

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return days * (vehicle.pricePerDay || 0)
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleBooking = async () => {
    if (purchaseMode === "RENTAL" && (!startDate || !endDate)) {
      toast.error("Veuillez sélectionner les dates de location")
      return
    }

    setIsBooking(true)
    try {
      if (purchaseMode === "RENTAL") {
        const formattedStart = format(startDate as Date, "yyyy-MM-dd")
        const formattedEnd = format(endDate as Date, "yyyy-MM-dd")
        addToLocalCart({
          id: `local-rental-${vehicle.id}-${Date.now()}`,
          type: "RENTAL",
          vehicleId: vehicle.id,
          vehicle: vehicle,
          quantity: 1,
          startDate: formattedStart,
          endDate: formattedEnd,
          pricePerUnit: vehicle.pricePerDay || 0,
          totalPrice: calculateTotalPrice(),
        })
      } else {
        addToLocalCart({
          id: `local-purchase-${vehicle.id}-${Date.now()}`,
          type: "PURCHASE",
          vehicleId: vehicle.id,
          vehicle,
          quantity: 1,
          pricePerUnit: vehicle.salePrice || 0,
          totalPrice: vehicle.salePrice || 0,
        })
      }
      toast.success("Véhicule ajouté au panier")
    } catch {
      toast.error("Erreur lors de la réservation")
    } finally {
      setIsBooking(false)
    }
  }

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(
      (blocked) => blocked.toDateString() === date.toDateString()
    ) || date < new Date()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
  }

  const submitReview = () => {
    if (!isAuthenticated || !user) {
      toast.error("Connectez-vous pour laisser un avis")
      return
    }
    if (!newReview.trim()) {
      toast.error("Écrivez un commentaire")
      return
    }
    const review: Review = {
      id: `review-${Date.now()}`,
      userId: user.id,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar },
      vehicleId: vehicle.id,
      rating: newRating,
      comment: newReview,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    }
    setReviews((prev) => [review, ...prev])
    setNewReview("")
    setNewRating(5)
    toast.success("Avis ajouté")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-secondary/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Accueil</Link>
            <span>/</span>
            <Link href="/vehicles" className="hover:text-foreground">Véhicules</Link>
            <span>/</span>
            <span className="text-foreground">{vehicle.brand} {vehicle.model}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            <div className="relative">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
                <img
                  src={vehicle.images[currentImageIndex]?.url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Navigation Arrows */}
              {vehicle.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
                    isLiked && "text-red-500"
                  )}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                      index === currentImageIndex 
                        ? "border-primary" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Rating */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{vehicle.category}</Badge>
                    {vehicle.type !== "SALE_ONLY" && <Badge className="bg-blue-600">Location</Badge>}
                    {vehicle.type !== "RENTAL" && <Badge className="bg-emerald-600">Vente</Badge>}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1">{vehicle.year}</p>
                </div>
                <div className="flex items-center gap-1 text-lg">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{vehicle.rating}</span>
                  <span className="text-muted-foreground">({vehicle.reviewCount} avis)</span>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Settings2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Transmission</p>
                  <p className="font-medium">{transmissionLabels[vehicle.transmission]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Fuel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Carburant</p>
                  <p className="font-medium">{fuelLabels[vehicle.fuelType]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Places</p>
                  <p className="font-medium">{vehicle.seats} places</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <DoorOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Portes</p>
                  <p className="font-medium">{vehicle.doors} portes</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Équipements</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({vehicle.reviewCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <p className="text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Kilométrage:</span>
                    <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Couleur:</span>
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                          {review.user.firstName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {review.user.firstName} {review.user.lastName?.charAt(0)}.
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-4 w-4",
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(review.createdAt), "PPP", { locale: fr })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-xl border p-4 space-y-3">
                    <p className="font-medium">Laisser un avis</p>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">Note:</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setNewRating(value)}
                            className="p-1"
                            aria-label={`Donner ${value} étoile${value > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={cn(
                                "h-5 w-5",
                                value <= newRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      rows={3}
                      placeholder="Partagez votre expérience..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                    />
                    <Button onClick={submitReview}>Publier l'avis</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatPrice(
                      purchaseMode === "PURCHASE"
                        ? vehicle.salePrice || 0
                        : vehicle.pricePerDay || 0
                    )}
                  </span>
                  <span className="text-lg text-muted-foreground">
                    {purchaseMode === "PURCHASE" ? "XAF" : "XAF/jour"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {vehicle.type === "BOTH" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={purchaseMode === "RENTAL" ? "default" : "outline"}
                      onClick={() => setPurchaseMode("RENTAL")}
                    >
                      Louer
                    </Button>
                    <Button
                      type="button"
                      variant={purchaseMode === "PURCHASE" ? "default" : "outline"}
                      onClick={() => setPurchaseMode("PURCHASE")}
                    >
                      Acheter
                    </Button>
                  </div>
                )}

                {/* Date Selection */}
                {purchaseMode === "RENTAL" && vehicle.type !== "SALE_ONLY" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Sélectionnez vos dates</span>
                  </div>
                  <CalendarComponent
                    mode="range"
                    selected={{ from: startDate, to: endDate }}
                    onSelect={(range) => {
                      setStartDate(range?.from)
                      setEndDate(range?.to)
                    }}
                    disabled={isDateBlocked}
                    className="rounded-lg border"
                    numberOfMonths={1}
                  />
                </div>
                )}

                <Separator />

                {/* Price Summary */}
                {purchaseMode === "RENTAL" && startDate && endDate && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatPrice(vehicle.pricePerDay || 0)} XAF x {calculateDays()} jours
                      </span>
                      <span>{formatPrice(calculateTotalPrice())} XAF</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotalPrice())} XAF</span>
                    </div>
                  </div>
                )}

                {purchaseMode === "PURCHASE" && vehicle.salePrice && (
                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span>Prix d'achat</span>
                      <span>{formatPrice(vehicle.salePrice)} XAF</span>
                    </div>
                  </div>
                )}

                {/* Booking Button */}
                <Button 
                  className="w-full gap-2 h-12 rounded-xl" 
                  size="lg"
                  onClick={handleBooking}
                  disabled={
                    isBooking ||
                    (purchaseMode === "RENTAL" && (!startDate || !endDate))
                  }
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isBooking
                    ? purchaseMode === "PURCHASE"
                      ? "Ajout..."
                      : "Réservation..."
                    : purchaseMode === "PURCHASE"
                    ? "Acheter maintenant"
                    : "Réserver maintenant"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Annulation gratuite jusqu&apos;à 24h avant la date de début
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
