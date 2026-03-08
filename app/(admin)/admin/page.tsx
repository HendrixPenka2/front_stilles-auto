"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Clock,
  MessageSquare,
  ArrowRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const stats = [
  {
    label: "Revenus du mois",
    value: "12.5M",
    suffix: "XAF",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Locations actives",
    value: "48",
    change: "+8",
    trend: "up",
    icon: Car,
  },
  {
    label: "Commandes accessoires",
    value: "156",
    change: "+23%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    label: "Nouveaux clients",
    value: "89",
    change: "-5%",
    trend: "down",
    icon: Users,
  },
]

const revenueData = [
  { month: "Jan", revenus: 8200000, locations: 42 },
  { month: "Fév", revenus: 9100000, locations: 45 },
  { month: "Mar", revenus: 8800000, locations: 40 },
  { month: "Avr", revenus: 10500000, locations: 52 },
  { month: "Mai", revenus: 11200000, locations: 58 },
  { month: "Jun", revenus: 12500000, locations: 65 },
]

const categoryData = [
  { name: "Berlines", value: 35 },
  { name: "SUV", value: 28 },
  { name: "4x4", value: 18 },
  { name: "Premium", value: 12 },
  { name: "Utilitaires", value: 7 },
]

const recentOrders = [
  {
    id: "CMD-2024-089",
    customer: "Jean Dupont",
    type: "Location",
    item: "Mercedes Classe E",
    amount: 375000,
    status: "active",
  },
  {
    id: "CMD-2024-088",
    customer: "Marie Kouam",
    type: "Achat",
    item: "Kit nettoyage premium",
    amount: 25000,
    status: "completed",
  },
  {
    id: "CMD-2024-087",
    customer: "Paul Nkeng",
    type: "Location",
    item: "BMW X5",
    amount: 285000,
    status: "pending",
  },
  {
    id: "CMD-2024-086",
    customer: "Aline Mbarga",
    type: "Location",
    item: "Range Rover Sport",
    amount: 450000,
    status: "active",
  },
]

const pendingReviews = [
  { id: 1, user: "Jean D.", vehicle: "Mercedes Classe E", rating: 5 },
  { id: 2, user: "Marie K.", vehicle: "BMW Série 5", rating: 4 },
  { id: 3, user: "Paul N.", vehicle: "Audi A6", rating: 3 },
]

function formatPrice(price: number) {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + "M XAF"
  }
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-success/10 text-success border-success/20">Actif</Badge>
    case "completed":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Terminé</Badge>
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">En attente</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de votre activité
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Dernier mois
          </Button>
          <Button>
            Télécharger rapport
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isUp = stat.trend === "up"
          return (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl lg:text-3xl font-bold">{stat.value}</span>
                      {stat.suffix && (
                        <span className="text-sm text-muted-foreground">{stat.suffix}</span>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm mt-1 ${
                        isUp ? "text-success" : "text-destructive"
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Évolution des revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPrice(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenus"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Locations par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Commandes récentes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="flex items-center gap-1">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.item} - {order.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="font-semibold">{formatPrice(order.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Avis en attente
            </CardTitle>
            <Badge variant="destructive">{pendingReviews.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 rounded-xl border border-border/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.user}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? "text-accent" : "text-muted"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.vehicle}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/reviews">Modérer les avis</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
