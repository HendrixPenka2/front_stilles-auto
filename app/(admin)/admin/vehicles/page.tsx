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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Car,
  Wrench,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react"

interface Vehicle {
  id: string
  name: string
  image: string
  category: string
  brand: string
  year: number
  pricePerDay: number
  status: "available" | "rented" | "maintenance"
  totalRentals: number
}

const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Mercedes Classe E",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=120&fit=crop",
    category: "Berline",
    brand: "Mercedes",
    year: 2023,
    pricePerDay: 75000,
    status: "available",
    totalRentals: 45,
  },
  {
    id: "2",
    name: "BMW X5",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=120&fit=crop",
    category: "SUV",
    brand: "BMW",
    year: 2023,
    pricePerDay: 95000,
    status: "rented",
    totalRentals: 38,
  },
  {
    id: "3",
    name: "Audi A6",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=120&fit=crop",
    category: "Berline",
    brand: "Audi",
    year: 2022,
    pricePerDay: 70000,
    status: "maintenance",
    totalRentals: 52,
  },
  {
    id: "4",
    name: "Range Rover Sport",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=120&fit=crop",
    category: "SUV",
    brand: "Land Rover",
    year: 2023,
    pricePerDay: 120000,
    status: "available",
    totalRentals: 28,
  },
  {
    id: "5",
    name: "Toyota Land Cruiser",
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=200&h=120&fit=crop",
    category: "4x4",
    brand: "Toyota",
    year: 2022,
    pricePerDay: 85000,
    status: "rented",
    totalRentals: 65,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

function getStatusBadge(status: Vehicle["status"]) {
  switch (status) {
    case "available":
      return <Badge className="bg-success/10 text-success border-success/20">Disponible</Badge>
    case "rented":
      return <Badge className="bg-primary/10 text-primary border-primary/20">En location</Badge>
    case "maintenance":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Maintenance</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    rented: vehicles.filter((v) => v.status === "rented").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <Car className="w-7 h-7" />
            Gestion de la flotte
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos véhicules de location
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/vehicles/new">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un véhicule
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total véhicules</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Disponibles</p>
            <p className="text-2xl font-bold text-success">{stats.available}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En location</p>
            <p className="text-2xl font-bold text-primary">{stats.rented}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En maintenance</p>
            <p className="text-2xl font-bold text-warning">{stats.maintenance}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un véhicule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Prix/jour</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden">
                          <Image
                            src={vehicle.image}
                            alt={vehicle.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.brand}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.category}</Badge>
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(vehicle.pricePerDay)}
                    </TableCell>
                    <TableCell>{vehicle.totalRentals}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/vehicles/${vehicle.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/vehicles/${vehicle.id}`}>
                              <Wrench className="w-4 h-4 mr-2" />
                              Actions admin
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedVehicle(vehicle)
                              setDeleteDialogOpen(true)
                            }}
                          >
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

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun véhicule trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le véhicule</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer{" "}
            <span className="font-medium text-foreground">
              {selectedVehicle?.name}
            </span>{" "}
            ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
