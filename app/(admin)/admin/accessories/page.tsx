"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  History,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Accessory {
  id: string
  name: string
  image: string
  category: string
  price: number
  stock: number
  minStock: number
  sold: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}

interface StockLog {
  id: string
  accessoryName: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  date: string
  user: string
}

const accessories: Accessory[] = [
  {
    id: "1",
    name: "Kit de nettoyage premium",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=200&h=200&fit=crop",
    category: "Entretien",
    price: 25000,
    stock: 45,
    minStock: 10,
    sold: 156,
    status: "in_stock",
  },
  {
    id: "2",
    name: "Support téléphone magnétique",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200&fit=crop",
    category: "Accessoires",
    price: 8500,
    stock: 8,
    minStock: 15,
    sold: 234,
    status: "low_stock",
  },
  {
    id: "3",
    name: "Tapis de sol premium",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&h=200&fit=crop",
    category: "Intérieur",
    price: 35000,
    stock: 0,
    minStock: 5,
    sold: 89,
    status: "out_of_stock",
  },
  {
    id: "4",
    name: "Chargeur USB double",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200&fit=crop",
    category: "Électronique",
    price: 12000,
    stock: 67,
    minStock: 20,
    sold: 312,
    status: "in_stock",
  },
  {
    id: "5",
    name: "Housse de siège cuir",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&h=200&fit=crop",
    category: "Intérieur",
    price: 85000,
    stock: 12,
    minStock: 10,
    sold: 45,
    status: "in_stock",
  },
]

const stockLogs: StockLog[] = [
  {
    id: "1",
    accessoryName: "Kit de nettoyage premium",
    type: "in",
    quantity: 50,
    reason: "Réapprovisionnement fournisseur",
    date: "2024-01-20 14:30",
    user: "Admin",
  },
  {
    id: "2",
    accessoryName: "Support téléphone magnétique",
    type: "out",
    quantity: 5,
    reason: "Vente client",
    date: "2024-01-20 11:15",
    user: "Système",
  },
  {
    id: "3",
    accessoryName: "Tapis de sol premium",
    type: "out",
    quantity: 3,
    reason: "Vente client",
    date: "2024-01-19 16:45",
    user: "Système",
  },
  {
    id: "4",
    accessoryName: "Chargeur USB double",
    type: "adjustment",
    quantity: -2,
    reason: "Inventaire - articles endommagés",
    date: "2024-01-18 10:00",
    user: "Admin",
  },
  {
    id: "5",
    accessoryName: "Housse de siège cuir",
    type: "in",
    quantity: 20,
    reason: "Nouvelle livraison",
    date: "2024-01-17 09:30",
    user: "Admin",
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

function getStockBadge(status: Accessory["status"]) {
  switch (status) {
    case "in_stock":
      return <Badge className="bg-success/10 text-success border-success/20">En stock</Badge>
    case "low_stock":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Stock faible</Badge>
    case "out_of_stock":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rupture</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getLogTypeBadge(type: StockLog["type"]) {
  switch (type) {
    case "in":
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          Entrée
        </Badge>
      )
    case "out":
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <ArrowDownRight className="w-3 h-3 mr-1" />
          Sortie
        </Badge>
      )
    case "adjustment":
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20">
          Ajustement
        </Badge>
      )
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

export default function AdminAccessoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const [stockDialogOpen, setStockDialogOpen] = useState(false)

  const filteredAccessories = accessories.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: accessories.length,
    inStock: accessories.filter((a) => a.status === "in_stock").length,
    lowStock: accessories.filter((a) => a.status === "low_stock").length,
    outOfStock: accessories.filter((a) => a.status === "out_of_stock").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <Package className="w-7 h-7" />
            Gestion des accessoires
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre inventaire d'accessoires
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/accessories/new">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un accessoire
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total produits</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En stock</p>
            <p className="text-2xl font-bold text-success">{stats.inStock}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stock faible</p>
              <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
            </div>
            {stats.lowStock > 0 && (
              <AlertTriangle className="w-5 h-5 text-warning" />
            )}
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rupture</p>
              <p className="text-2xl font-bold text-destructive">{stats.outOfStock}</p>
            </div>
            {stats.outOfStock > 0 && (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Journal des stocks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un accessoire..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Vendus</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccessories.map((accessory) => (
                      <TableRow key={accessory.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={accessory.image}
                                alt={accessory.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{accessory.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{accessory.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(accessory.price)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              accessory.stock <= accessory.minStock
                                ? "text-warning font-medium"
                                : ""
                            }
                          >
                            {accessory.stock}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {" "}
                            / min {accessory.minStock}
                          </span>
                        </TableCell>
                        <TableCell>{accessory.sold}</TableCell>
                        <TableCell>{getStockBadge(accessory.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAccessory(accessory)
                                  setStockDialogOpen(true)
                                }}
                              >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Ajuster stock
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/accessories/${accessory.id}/edit`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Journal des mouvements de stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Utilisateur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-muted-foreground">
                          {log.date}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.accessoryName}
                        </TableCell>
                        <TableCell>{getLogTypeBadge(log.type)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              log.type === "in"
                                ? "text-success"
                                : log.type === "out"
                                ? "text-destructive"
                                : ""
                            }
                          >
                            {log.type === "in" ? "+" : ""}
                            {log.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{log.reason}</TableCell>
                        <TableCell>{log.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Dialog */}
      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuster le stock</DialogTitle>
          </DialogHeader>
          {selectedAccessory && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={selectedAccessory.image}
                    alt={selectedAccessory.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedAccessory.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Stock actuel: {selectedAccessory.stock}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-1">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>Entrée</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-1">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  <span>Sortie</span>
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantité</label>
                <Input type="number" placeholder="0" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Raison</label>
                <Input placeholder="Ex: Réapprovisionnement fournisseur" />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStockDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button className="flex-1">Confirmer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
