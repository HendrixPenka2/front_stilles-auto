"use client"

import { useState } from "react"
import { FileText, Upload, X } from "lucide-react"
import { useAuthStore } from "@/lib/stores"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockCrmApi, type ImportExportType } from "@/lib/mock-crm"

export default function ImportExportPage() {
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documents, setDocuments] = useState<File[]>([])
  const [form, setForm] = useState({
    type: "IMPORT" as ImportExportType,
    vehicleDescription: "",
    originCountry: "",
    destinationCountry: "",
    estimatedBudget: "",
  })

  const handleDocumentsSelection = (filesList: FileList | null) => {
    const files = Array.from(filesList || [])
    const allowed = ["application/pdf", "image/jpeg", "image/png"]
    const valid = files.filter((file) => allowed.includes(file.type))
    setDocuments((prev) => [...prev, ...valid])
  }

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const request = await mockCrmApi.createImportExportRequest({
        userId: user?.id || "guest-user",
        userEmail: user?.email || "guest@stillesauto.com",
        type: form.type,
        vehicleDescription: form.vehicleDescription,
        originCountry: form.originCountry,
        destinationCountry: form.destinationCountry,
        estimatedBudget: Number(form.estimatedBudget || 0),
      })

      for (const document of documents) {
        await mockCrmApi.uploadImportExportDocument(request.id, document)
      }

      toast.success("Demande import/export soumise")
      setForm({ type: "IMPORT", vehicleDescription: "", originCountry: "", destinationCountry: "", estimatedBudget: "" })
      setDocuments([])
    } catch {
      toast.error("Erreur lors de l'envoi de la demande")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Service Import / Export</h1>
        <p className="text-muted-foreground max-w-3xl">
          Nous vous accompagnons de A à Z: sourcing véhicule, inspection, conformité documentaire,
          transit, dédouanement et livraison. Déposez votre demande détaillée ci-dessous.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demande détaillée</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de requête</Label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as ImportExportType }))}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3"
                >
                  <option value="IMPORT">IMPORT</option>
                  <option value="EXPORT">EXPORT</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget estimé (XAF)</Label>
                <Input id="budget" type="number" value={form.estimatedBudget} onChange={(e) => setForm((p) => ({ ...p, estimatedBudget: e.target.value }))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleDescription">Description du véhicule</Label>
              <Textarea
                id="vehicleDescription"
                rows={5}
                placeholder="Ex: Toyota Land Cruiser 2021 diesel automatique, faible kilométrage..."
                value={form.vehicleDescription}
                onChange={(e) => setForm((p) => ({ ...p, vehicleDescription: e.target.value }))}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originCountry">Pays d'origine</Label>
                <Input id="originCountry" value={form.originCountry} onChange={(e) => setForm((p) => ({ ...p, originCountry: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationCountry">Pays de destination</Label>
                <Input id="destinationCountry" value={form.destinationCountry} onChange={(e) => setForm((p) => ({ ...p, destinationCountry: e.target.value }))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Documents justificatifs (PDF, JPEG, PNG)</Label>
              <label className="block rounded-xl border-2 border-dashed border-border p-6 hover:border-primary/60 transition-colors cursor-pointer bg-secondary/20">
                <input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => handleDocumentsSelection(e.target.files)}
                />
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Importer des documents</p>
                  <p className="text-sm text-muted-foreground">Glissez-déposez ici ou cliquez pour sélectionner vos fichiers</p>
                </div>
              </label>

              {documents.length > 0 && (
                <div className="space-y-2 rounded-xl border p-3">
                  <p className="text-sm font-medium">Fichiers sélectionnés ({documents.length})</p>
                  <div className="grid gap-2">
                    {documents.map((document, index) => (
                      <div key={`${document.name}-${index}`} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 shrink-0" />
                          <span className="text-sm truncate">{document.name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Soumettre la demande"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
