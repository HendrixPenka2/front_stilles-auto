"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Car,
  Fuel,
  Users,
  Settings,
  Trash2,
  ShoppingCart,
  Eye,
} from "lucide-react"

const favoriteVehicles = [
  {
    id: "1",
    name: "Mercedes Classe E",
    category: "Berline",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop",
    pricePerDay: 75000,
    fuel: "Diesel",
    seats: 5,
    transmission: "Automatique",
    available: true,
  },
  {
    id: "2",
    name: "BMW X5",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    pricePerDay: 95000,
    fuel: "Essence",
    seats: 7,
    transmission: "Automatique",
    available: true,
  },
  {
    id: "3",
    name: "Audi A6",
    category: "Berline",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    pricePerDay: 70000,
    fuel: "Diesel",
    seats: 5,
    transmission: "Automatique",
    available: false,
  },
]

const favoriteAccessories = [
  {
    id: "1",
    name: "Kit de nettoyage premium",
    category: "Entretien",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop",
    price: 25000,
    inStock: true,
  },
  {
    id: "2",
    name: "Support téléphone magnétique",
    category: "Accessoires",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
    price: 8500,
    inStock: true,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

export default function FavoritesPage() {
  const [vehicles, setVehicles] = useState(favoriteVehicles)
  const [accessories, setAccessories] = useState(favoriteAccessories)

  const removeVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
  }

  const removeAccessory = (id: string) => {
    setAccessories(accessories.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <Heart className="w-7 h-7 text-destructive" />
          Mes favoris
        </h1>
        <p className="text-muted-foreground mt-1">
          Retrouvez tous vos véhicules et accessoires favoris
        </p>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Véhicules ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="accessories" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Accessoires ({accessories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          {vehicles.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Aucun véhicule favori</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Parcourez notre catalogue et ajoutez des véhicules à vos favoris
                </p>
                <Button asChild>
                  <Link href="/vehicles">Voir les véhicules</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden group border-border/50">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {!vehicle.available && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="secondary" className="text-sm">
                          Indisponible
                        </Badge>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeVehicle(vehicle.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {vehicle.category}
                      </Badge>
                      <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        {vehicle.fuel}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {vehicle.seats}
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        {vehicle.transmission}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-lg font-bold">
                          {formatPrice(vehicle.pricePerDay)}
                        </span>
                        <span className="text-sm text-muted-foreground">/jour</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/vehicles/${vehicle.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="icon" disabled={!vehicle.available}>
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accessories" className="space-y-4">
          {accessories.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Aucun accessoire favori</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Parcourez notre catalogue et ajoutez des accessoires à vos favoris
                </p>
                <Button asChild>
                  <Link href="/accessories">Voir les accessoires</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessories.map((accessory) => (
                <Card key={accessory.id} className="overflow-hidden group border-border/50">
                  <div className="relative aspect-square">
                    <Image
                      src={accessory.image}
                      alt={accessory.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeAccessory(accessory.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {accessory.category}
                      </Badge>
                      <h3 className="font-semibold">{accessory.name}</h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        {formatPrice(accessory.price)}
                      </span>
                      <Button size="sm" disabled={!accessory.inStock}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
