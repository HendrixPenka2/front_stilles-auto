"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  ShoppingBag,
  Car,
  Clock,
  ArrowRight,
  Calendar,
  MapPin,
} from "lucide-react"

const stats = [
  { label: "Véhicules loués", value: "12", icon: Car, trend: "+2 ce mois" },
  { label: "Favoris", value: "8", icon: Heart, trend: "3 disponibles" },
  { label: "Commandes actives", value: "2", icon: ShoppingBag, trend: "En cours" },
  { label: "Réservations", value: "5", icon: Clock, trend: "À venir" },
]

const recentOrders = [
  {
    id: "CMD-2024-001",
    type: "location",
    vehicle: "Mercedes Classe E",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=120&fit=crop",
    status: "active",
    dates: "15 Jan - 20 Jan 2024",
    price: 350000,
  },
  {
    id: "CMD-2024-002",
    type: "achat",
    vehicle: "Kit de nettoyage premium",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=200&h=120&fit=crop",
    status: "delivered",
    dates: "10 Jan 2024",
    price: 25000,
  },
  {
    id: "CMD-2024-003",
    type: "location",
    vehicle: "BMW Série 5",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=120&fit=crop",
    status: "pending",
    dates: "25 Jan - 28 Jan 2024",
    price: 420000,
  },
]

const upcomingReservations = [
  {
    vehicle: "Audi A6",
    location: "Douala",
    startDate: "25 Jan 2024",
    endDate: "28 Jan 2024",
  },
  {
    vehicle: "Range Rover Sport",
    location: "Yaoundé",
    startDate: "02 Fév 2024",
    endDate: "05 Fév 2024",
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-success/10 text-success border-success/20">En cours</Badge>
    case "delivered":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Livré</Badge>
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">En attente</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-balance">
          Bienvenue, Jean
        </h1>
        <p className="text-muted-foreground mt-1">
          Voici un aperçu de votre activité récente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl lg:text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Commandes récentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders" className="flex items-center gap-1">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={order.image}
                    alt={order.vehicle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{order.vehicle}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{order.dates}</p>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">{formatPrice(order.price)}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {order.type}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Réservations à venir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingReservations.map((reservation, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-border/50 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" />
                  <span className="font-medium">{reservation.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{reservation.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {reservation.startDate} - {reservation.endDate}
                  </span>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full" asChild>
              <Link href="/vehicles">
                Nouvelle réservation
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/vehicles">
                <Car className="w-5 h-5" />
                <span>Louer un véhicule</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/accessories">
                <ShoppingBag className="w-5 h-5" />
                <span>Acheter accessoires</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/favorites">
                <Heart className="w-5 h-5" />
                <span>Mes favoris</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/profile">
                <Clock className="w-5 h-5" />
                <span>Historique</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
