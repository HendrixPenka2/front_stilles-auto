"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Upload, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const initialImages = [
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&q=80",
  "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500&q=80",
]

export default function EditAccessoryPage() {
  const params = useParams<{ id: string }>()
  const [name, setName] = useState("Accessoire")
  const [price, setPrice] = useState("25000")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>(initialImages)

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...imageUrls])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/accessories"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-2xl font-bold">Modifier accessoire #{params.id}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="images" className="inline-flex">
            <input id="images" type="file" multiple accept="image/*" className="hidden" onChange={onPickImages} />
            <Button type="button" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Ajouter des images</span>
            </Button>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="relative rounded-lg overflow-hidden border aspect-square">
                <img src={image} alt={`image-${index}`} className="w-full h-full object-cover" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Button onClick={() => toast.success("Accessoire mis à jour")}><Save className="h-4 w-4 mr-2" />Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
