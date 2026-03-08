"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Check,
  X,
  Eye,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type ReviewStatus = "pending" | "approved" | "rejected" | "flagged"

interface Review {
  id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  vehicle: {
    name: string
    image: string
  }
  rating: number
  title: string
  content: string
  date: string
  status: ReviewStatus
  rentalId: string
}

const reviews: Review[] = [
  {
    id: "1",
    user: {
      name: "Jean Dupont",
      email: "jean@email.com",
    },
    vehicle: {
      name: "Mercedes Classe E",
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=120&fit=crop",
    },
    rating: 5,
    title: "Excellente expérience",
    content:
      "Véhicule impeccable, très confortable pour un long trajet. Le service client était au top, je recommande vivement !",
    date: "2024-01-20",
    status: "pending",
    rentalId: "LOC-2024-089",
  },
  {
    id: "2",
    user: {
      name: "Marie Kouam",
      email: "marie@email.com",
    },
    vehicle: {
      name: "BMW Série 5",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=120&fit=crop",
    },
    rating: 4,
    title: "Très satisfaite",
    content:
      "Belle voiture, bien entretenue. Petit bémol sur le délai de livraison qui était un peu long.",
    date: "2024-01-19",
    status: "pending",
    rentalId: "LOC-2024-085",
  },
  {
    id: "3",
    user: {
      name: "Paul Nkeng",
      email: "paul@email.com",
    },
    vehicle: {
      name: "Audi A6",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=120&fit=crop",
    },
    rating: 3,
    title: "Correct mais peut mieux faire",
    content:
      "La voiture était propre mais j'ai trouvé que les pneus étaient un peu usés. Service client réactif cependant.",
    date: "2024-01-18",
    status: "pending",
    rentalId: "LOC-2024-082",
  },
  {
    id: "4",
    user: {
      name: "Aline Mbarga",
      email: "aline@email.com",
    },
    vehicle: {
      name: "Range Rover Sport",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=120&fit=crop",
    },
    rating: 1,
    title: "Très déçue",
    content:
      "Contenu inapproprié signalé - ce commentaire contient des propos offensants.",
    date: "2024-01-17",
    status: "flagged",
    rentalId: "LOC-2024-078",
  },
  {
    id: "5",
    user: {
      name: "Eric Fotso",
      email: "eric@email.com",
    },
    vehicle: {
      name: "Toyota Land Cruiser",
      image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=200&h=120&fit=crop",
    },
    rating: 5,
    title: "Parfait pour le safari",
    content:
      "Véhicule parfait pour notre excursion. Robuste, confortable et bien équipé. Merci Stilles Auto !",
    date: "2024-01-15",
    status: "approved",
    rentalId: "LOC-2024-072",
  },
]

function getStatusConfig(status: ReviewStatus) {
  switch (status) {
    case "pending":
      return {
        label: "En attente",
        icon: Clock,
        className: "bg-warning/10 text-warning border-warning/20",
      }
    case "approved":
      return {
        label: "Approuvé",
        icon: CheckCircle,
        className: "bg-success/10 text-success border-success/20",
      }
    case "rejected":
      return {
        label: "Rejeté",
        icon: XCircle,
        className: "bg-destructive/10 text-destructive border-destructive/20",
      }
    case "flagged":
      return {
        label: "Signalé",
        icon: Flag,
        className: "bg-destructive/10 text-destructive border-destructive/20",
      }
    default:
      return {
        label: status,
        icon: AlertTriangle,
        className: "",
      }
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "fill-accent text-accent" : "text-muted"
          )}
        />
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [reviewsList, setReviewsList] = useState(reviews)

  const pendingReviews = reviewsList.filter((r) => r.status === "pending")
  const flaggedReviews = reviewsList.filter((r) => r.status === "flagged")
  const processedReviews = reviewsList.filter(
    (r) => r.status === "approved" || r.status === "rejected"
  )

  const approveReview = (id: string) => {
    setReviewsList(
      reviewsList.map((r) =>
        r.id === id ? { ...r, status: "approved" as ReviewStatus } : r
      )
    )
    toast.success("Avis approuvé")
    setDetailDialogOpen(false)
  }

  const rejectReview = (id: string) => {
    setReviewsList(
      reviewsList.map((r) =>
        r.id === id ? { ...r, status: "rejected" as ReviewStatus } : r
      )
    )
    toast.success("Avis rejeté")
    setRejectDialogOpen(false)
    setDetailDialogOpen(false)
    setRejectReason("")
  }

  const ReviewCard = ({ review }: { review: Review }) => {
    const statusConfig = getStatusConfig(review.status)
    const StatusIcon = statusConfig.icon

    return (
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Vehicle Image */}
            <div className="relative w-full md:w-32 aspect-video md:aspect-[4/3] rounded-lg overflow-hidden shrink-0">
              <Image
                src={review.vehicle.image}
                alt={review.vehicle.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.user.avatar} />
                    <AvatarFallback>
                      {review.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.vehicle.name}
                    </p>
                  </div>
                </div>
                <Badge className={statusConfig.className}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} />
                <span className="text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>

              <div>
                <h4 className="font-medium">{review.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {review.content}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedReview(review)
                    setDetailDialogOpen(true)
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </Button>

                {review.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90"
                      onClick={() => approveReview(review.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approuver
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review)
                        setRejectDialogOpen(true)
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rejeter
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="w-7 h-7" />
          Modération des avis
        </h1>
        <p className="text-muted-foreground mt-1">
          Approuvez ou rejetez les avis des clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingReviews.length}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Flag className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{flaggedReviews.length}</p>
              <p className="text-sm text-muted-foreground">Signalés</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{processedReviews.length}</p>
              <p className="text-sm text-muted-foreground">Traités</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            En attente
            {pendingReviews.length > 0 && (
              <Badge variant="secondary">{pendingReviews.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="flagged" className="flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Signalés
            {flaggedReviews.length > 0 && (
              <Badge variant="destructive">{flaggedReviews.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processed">Traités</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-success/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Tout est à jour</h3>
                <p className="text-muted-foreground">
                  Aucun avis en attente de modération
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          {flaggedReviews.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-success/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Aucun signalement</h3>
                <p className="text-muted-foreground">
                  Aucun avis signalé à traiter
                </p>
              </CardContent>
            </Card>
          ) : (
            flaggedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de l'avis</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedReview.user.avatar} />
                  <AvatarFallback>
                    {selectedReview.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedReview.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.user.email}
                  </p>
                </div>
              </div>

              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={selectedReview.vehicle.image}
                  alt={selectedReview.vehicle.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Véhicule</span>
                  <span className="font-medium">{selectedReview.vehicle.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-mono text-sm">{selectedReview.rentalId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Note</span>
                  <StarRating rating={selectedReview.rating} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/30">
                <h4 className="font-medium mb-2">{selectedReview.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedReview.content}
                </p>
              </div>

              {selectedReview.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() => approveReview(selectedReview.id)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setRejectDialogOpen(true)
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l'avis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Veuillez indiquer la raison du rejet. Un email sera envoyé à l'utilisateur.
            </p>
            <Textarea
              placeholder="Raison du rejet..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setRejectDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => selectedReview && rejectReview(selectedReview.id)}
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
