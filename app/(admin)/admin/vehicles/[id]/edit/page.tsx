"use client"

import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdminVehicleEditPage() {
  const params = useParams<{ id: string }>()
  const [name, setName] = useState("Véhicule")
  const [priceDay, setPriceDay] = useState("75000")
  const [salePrice, setSalePrice] = useState("0")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=500&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80",
  ])

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...imageUrls])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/vehicles/${params.id}`}><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Modifier véhicule #{params.id}</h1>
          <p className="text-muted-foreground">Mettez à jour les informations du véhicule.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Édition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Images</Label>
            <label className="inline-flex">
              <input type="file" multiple accept="image/*" className="hidden" onChange={onPickImages} />
              <Button type="button" asChild>
                <span><Upload className="h-4 w-4 mr-2" />Ajouter des images</span>
              </Button>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative border rounded-lg overflow-hidden aspect-square">
                  <img src={image} alt={`vehicle-${index}`} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceDay">Prix location/jour</Label>
              <Input id="priceDay" value={priceDay} onChange={(e) => setPriceDay(e.target.value)} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Prix vente</Label>
              <Input id="salePrice" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} type="number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button onClick={() => toast.success("Véhicule modifié")} className="gap-2"><Save className="h-4 w-4" />Sauvegarder</Button>
        </CardContent>
      </Card>
    </div>
  )
}
