"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Search, Eye, CheckCircle2, Clock, XCircle, Truck } from "lucide-react"

type OrderStatus = "pending" | "confirmed" | "processing" | "completed" | "cancelled"

type OrderType = "location" | "achat"

interface AdminOrder {
  id: string
  client: string
  email: string
  type: OrderType
  item: string
  amount: number
  date: string
  status: OrderStatus
}

const mockOrders: AdminOrder[] = [
  {
    id: "CMD-2026-145",
    client: "Jean Dupont",
    email: "jean@email.com",
    type: "location",
    item: "Mercedes Classe E (3 jours)",
    amount: 225000,
    date: "2026-03-06",
    status: "processing",
  },
  {
    id: "CMD-2026-144",
    client: "Marie Kouam",
    email: "marie@email.com",
    type: "achat",
    item: "Kit nettoyage premium",
    amount: 25000,
    date: "2026-03-06",
    status: "completed",
  },
  {
    id: "CMD-2026-143",
    client: "Paul Nkeng",
    email: "paul@email.com",
    type: "location",
    item: "BMW X5 (2 jours)",
    amount: 190000,
    date: "2026-03-05",
    status: "pending",
  },
  {
    id: "CMD-2026-142",
    client: "Aline Mbarga",
    email: "aline@email.com",
    type: "achat",
    item: "Caméra de recul",
    amount: 45000,
    date: "2026-03-05",
    status: "confirmed",
  },
  {
    id: "CMD-2026-141",
    client: "Eric Fotso",
    email: "eric@email.com",
    type: "location",
    item: "Toyota Land Cruiser (5 jours)",
    amount: 425000,
    date: "2026-03-04",
    status: "cancelled",
  },
]

function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} XAF`
}

function getStatusConfig(status: OrderStatus) {
  switch (status) {
    case "pending":
      return {
        label: "En attente",
        className: "bg-warning/10 text-warning border-warning/20",
        icon: Clock,
      }
    case "confirmed":
      return {
        label: "Confirmée",
        className: "bg-primary/10 text-primary border-primary/20",
        icon: CheckCircle2,
      }
    case "processing":
      return {
        label: "En cours",
        className: "bg-primary/10 text-primary border-primary/20",
        icon: Truck,
      }
    case "completed":
      return {
        label: "Terminée",
        className: "bg-success/10 text-success border-success/20",
        icon: CheckCircle2,
      }
    case "cancelled":
      return {
        label: "Annulée",
        className: "bg-destructive/10 text-destructive border-destructive/20",
        icon: XCircle,
      }
    default:
      return {
        label: status,
        className: "",
        icon: Clock,
      }
  }
}

export default function AdminOrdersPage() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all")

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return mockOrders.filter((order) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.client.toLowerCase().includes(normalizedQuery) ||
        order.email.toLowerCase().includes(normalizedQuery) ||
        order.item.toLowerCase().includes(normalizedQuery)

      const matchesStatus = activeTab === "all" || order.status === activeTab

      return matchesQuery && matchesStatus
    })
  }, [query, activeTab])

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter((order) => order.status === "pending").length,
    processing: mockOrders.filter((order) => order.status === "processing").length,
    completed: mockOrders.filter((order) => order.status === "completed").length,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-7 h-7" />
            Gestion des commandes
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivi des locations et achats accessoires
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En cours</p>
            <p className="text-2xl font-bold text-primary">{stats.processing}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Terminées</p>
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher par ID, client, email ou produit..."
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus | "all")}>
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="processing">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Aucune commande trouvée pour ce filtre.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = getStatusConfig(order.status)
              const StatusIcon = status.icon

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-border/50 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.client} • {order.email}
                    </p>
                    <p className="text-sm">{order.item}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString("fr-FR")}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge variant="outline">
                      {order.type === "location" ? "Location" : "Achat"}
                    </Badge>
                    <Badge className={status.className}>
                      <StatusIcon className="w-3.5 h-3.5 mr-1" />
                      {status.label}
                    </Badge>
                    <span className="font-semibold min-w-[110px] text-right">{formatPrice(order.amount)}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/crm/contact">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir dossier
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
