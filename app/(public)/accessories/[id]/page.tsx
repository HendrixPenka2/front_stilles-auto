"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Star, ShoppingCart, Check } from "lucide-react"
import { useAuthStore, useCartStore } from "@/lib/stores"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { Accessory, Review } from "@/lib/types"

const mockAccessory: Accessory = {
  id: "1",
  name: "Kit de nettoyage premium",
  description: "Kit complet pour entretien intérieur et extérieur.",
  category: "Entretien",
  price: 25000,
  stock: 12,
  images: ["https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1000&q=80"],
  specifications: { pieces: "12", usage: "Intérieur/Extérieur" },
  rating: 4.6,
  reviewCount: 21,
  inStock: true,
  createdAt: new Date().toISOString(),
}

const initialReviews: Review[] = [
  {
    id: "ar-1",
    userId: "u1",
    user: { id: "u1", firstName: "Paul", lastName: "N" },
    accessoryId: "1",
    rating: 5,
    comment: "Très bon rapport qualité/prix.",
    status: "APPROVED",
    createdAt: new Date().toISOString(),
  },
]

export default function AccessoryDetailPage() {
  const params = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuthStore()
  const { addToLocalCart } = useCartStore()
  const [accessory] = useState<Accessory>({ ...mockAccessory, id: params.id || "1" })
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)

  const addToCart = () => {
    addToLocalCart({
      id: `local-accessory-${accessory.id}-${Date.now()}`,
      type: "PURCHASE",
      accessoryId: accessory.id,
      accessory,
      quantity: 1,
      pricePerUnit: accessory.price,
      totalPrice: accessory.price,
    })
    toast.success("Accessoire ajouté au panier")
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
      id: `ar-${Date.now()}`,
      userId: user.id,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar },
      accessoryId: accessory.id,
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <nav className="text-sm text-muted-foreground">
        <Link href="/">Accueil</Link> / <Link href="/accessories">Accessoires</Link> / {accessory.name}
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        <img src={accessory.images[0]} alt={accessory.name} className="w-full rounded-2xl border object-cover" />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{accessory.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge>{accessory.category}</Badge>
              <Badge variant="outline">{new Intl.NumberFormat("fr-FR").format(accessory.price)} XAF</Badge>
            </div>
            <p className="text-muted-foreground">{accessory.description}</p>
            <p className="text-sm">Stock: {accessory.stock}</p>
            <Button onClick={addToCart} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Ajouter au panier
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Avis clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.user.firstName}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className={index < review.rating ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-muted-foreground"} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
            </div>
          ))}

          <Separator />

          <div className="space-y-3">
            <p className="font-medium">Laisser un avis</p>
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
                    className={
                      value <= newRating
                        ? "h-5 w-5 fill-amber-400 text-amber-400"
                        : "h-5 w-5 text-muted-foreground"
                    }
                  />
                </button>
              ))}
            </div>
            <Textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} rows={3} placeholder="Votre avis..." />
            <Button onClick={submitReview} className="gap-2">
              <Check className="h-4 w-4" />
              Publier l'avis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
