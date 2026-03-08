"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Upload,
  X,
  Car,
  Save,
  ImagePlus,
} from "lucide-react"
import { toast } from "sonner"

const categories = ["Berline", "SUV", "4x4", "Premium", "Utilitaire", "Compact"]
const brands = ["Mercedes", "BMW", "Audi", "Range Rover", "Toyota", "Porsche", "Lexus"]
const fuelTypes = ["Essence", "Diesel", "Hybride", "Électrique"]
const transmissions = ["Automatique", "Manuelle"]

const features = [
  "Climatisation",
  "GPS",
  "Bluetooth",
  "Caméra de recul",
  "Sièges chauffants",
  "Toit ouvrant",
  "Régulateur de vitesse",
  "Aide au stationnement",
  "Apple CarPlay",
  "Android Auto",
]

export default function NewVehiclePage() {
  const [images, setImages] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...imageUrls])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
    } else {
      setSelectedFeatures([...selectedFeatures, feature])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success("Véhicule créé avec succès")
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/vehicles">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Nouveau véhicule</h1>
          <p className="text-muted-foreground mt-1">
            Ajoutez un nouveau véhicule à votre flotte
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="w-5 h-5" />
              Images
            </CardTitle>
            <CardDescription>
              Ajoutez des photos du véhicule (minimum 3 recommandé)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Upload className="w-8 h-8" />
                <span className="text-sm">Importer</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du véhicule</Label>
                <Input id="name" placeholder="Ex: Mercedes Classe E" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marque</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand.toLowerCase()}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <Input id="year" type="number" placeholder="2023" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Places</Label>
                <Input id="seats" type="number" placeholder="5" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doors">Portes</Label>
                <Input id="doors" type="number" placeholder="4" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel">Carburant</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel} value={fuel.toLowerCase()}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((trans) => (
                      <SelectItem key={trans} value={trans.toLowerCase()}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le véhicule..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Tarification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceDay">Prix par jour (XAF)</Label>
                <Input id="priceDay" type="number" placeholder="75000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceWeek">Prix par semaine (XAF)</Label>
                <Input id="priceWeek" type="number" placeholder="450000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceMonth">Prix par mois (XAF)</Label>
                <Input id="priceMonth" type="number" placeholder="1500000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Caution (XAF)</Label>
              <Input id="deposit" type="number" placeholder="200000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialStatus">Statut initial</Label>
              <Select defaultValue="maintenance">
                <SelectTrigger id="initialStatus">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance (recommandé)</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Équipements</CardTitle>
            <CardDescription>
              Sélectionnez les équipements disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {features.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/vehicles">Annuler</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Création en cours..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Créer le véhicule
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
