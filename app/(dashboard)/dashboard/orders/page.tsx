"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ShoppingBag,
  Car,
  Package,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Download,
  MessageSquare,
} from "lucide-react"

type OrderStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled"
type OrderType = "location" | "achat"

interface Order {
  id: string
  type: OrderType
  status: OrderStatus
  item: {
    name: string
    image: string
    category: string
  }
  dates?: {
    start: string
    end: string
  }
  location?: string
  quantity?: number
  total: number
  createdAt: string
}

const orders: Order[] = [
  {
    id: "CMD-2024-001",
    type: "location",
    status: "active",
    item: {
      name: "Mercedes Classe E",
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop",
      category: "Berline",
    },
    dates: { start: "15 Jan 2024", end: "20 Jan 2024" },
    location: "Douala, Cameroun",
    total: 375000,
    createdAt: "12 Jan 2024",
  },
  {
    id: "CMD-2024-002",
    type: "achat",
    status: "completed",
    item: {
      name: "Kit de nettoyage premium",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop",
      category: "Entretien",
    },
    quantity: 1,
    total: 25000,
    createdAt: "10 Jan 2024",
  },
  {
    id: "CMD-2024-003",
    type: "location",
    status: "pending",
    item: {
      name: "BMW X5",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
      category: "SUV",
    },
    dates: { start: "25 Jan 2024", end: "28 Jan 2024" },
    location: "Yaoundé, Cameroun",
    total: 285000,
    createdAt: "18 Jan 2024",
  },
  {
    id: "CMD-2024-004",
    type: "achat",
    status: "confirmed",
    item: {
      name: "Support téléphone magnétique",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
      category: "Accessoires",
    },
    quantity: 2,
    total: 17000,
    createdAt: "20 Jan 2024",
  },
  {
    id: "CMD-2023-089",
    type: "location",
    status: "completed",
    item: {
      name: "Audi A6",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      category: "Berline",
    },
    dates: { start: "01 Déc 2023", end: "05 Déc 2023" },
    location: "Douala, Cameroun",
    total: 350000,
    createdAt: "28 Nov 2023",
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

function getStatusConfig(status: OrderStatus) {
  switch (status) {
    case "pending":
      return { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" }
    case "confirmed":
      return { label: "Confirmée", className: "bg-primary/10 text-primary border-primary/20" }
    case "active":
      return { label: "En cours", className: "bg-success/10 text-success border-success/20" }
    case "completed":
      return { label: "Terminée", className: "bg-muted text-muted-foreground" }
    case "cancelled":
      return { label: "Annulée", className: "bg-destructive/10 text-destructive border-destructive/20" }
    default:
      return { label: status, className: "" }
  }
}

function OrderCard({ order }: { order: Order }) {
  const statusConfig = getStatusConfig(order.status)

  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-square shrink-0">
          <Image
            src={order.item.image}
            alt={order.item.name}
            fill
            className="object-cover"
          />
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 capitalize"
          >
            {order.type === "location" ? "Location" : "Achat"}
          </Badge>
        </div>

        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{order.id}</p>
                <h3 className="font-semibold text-lg mt-1">{order.item.name}</h3>
                <Badge variant="outline" className="mt-2">
                  {order.item.category}
                </Badge>
              </div>
              <Badge className={statusConfig.className}>
                {statusConfig.label}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {order.dates && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {order.dates.start} - {order.dates.end}
                  </span>
                </div>
              )}
              {order.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{order.location}</span>
                </div>
              )}
              {order.quantity && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Quantité: {order.quantity}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Commandé le {order.createdAt}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Total</span>
                <p className="text-xl font-bold">{formatPrice(order.total)}</p>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Détails
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Détails de la commande</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={order.item.image}
                          alt={order.item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Numéro</span>
                          <span className="font-medium">{order.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Article</span>
                          <span className="font-medium">{order.item.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium capitalize">{order.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Statut</span>
                          <Badge className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Facture
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Support
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {order.status === "completed" && (
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Facture
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<"all" | "location" | "achat">("all")

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    return order.type === filter
  })

  const activeOrders = filteredOrders.filter(
    (o) => o.status === "active" || o.status === "pending" || o.status === "confirmed"
  )
  const pastOrders = filteredOrders.filter(
    (o) => o.status === "completed" || o.status === "cancelled"
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="w-7 h-7" />
            Mes commandes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos locations et achats
          </p>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="achat" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Achats
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Commandes actives</h2>
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Historique</h2>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {filteredOrders.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aucune commande</h3>
            <p className="text-muted-foreground text-center">
              Vous n'avez pas encore passé de commande
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
