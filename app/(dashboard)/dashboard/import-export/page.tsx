"use client"

import { useEffect, useState } from "react"
import { Upload, FileText } from "lucide-react"
import { useAuthStore } from "@/lib/stores"
import { mockCrmApi, type ImportExportRequest } from "@/lib/mock-crm"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statusLabel: Record<string, string> = {
  SUBMITTED: "Soumise",
  UNDER_REVIEW: "En revue",
  QUOTE_SENT: "Devis envoyé",
  ACCEPTED: "Acceptée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  REJECTED: "Rejetée",
}

export default function ImportExportTrackingPage() {
  const { user } = useAuthStore()
  const [requests, setRequests] = useState<ImportExportRequest[]>([])

  const load = async () => {
    const data = await mockCrmApi.listMyImportExport(user?.id, user?.email)
    setRequests(data)
  }

  useEffect(() => {
    load()
  }, [user?.id, user?.email])

  const uploadDocument = async (requestId: string, file?: File) => {
    if (!file) return
    const allowed = ["application/pdf", "image/jpeg", "image/png"]
    if (!allowed.includes(file.type)) {
      toast.error("Formats autorisés: PDF, JPEG, PNG")
      return
    }

    try {
      await mockCrmApi.uploadImportExportDocument(requestId, file)
      toast.success("Document envoyé")
      await load()
    } catch {
      toast.error("Échec upload document")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Suivi Import / Export</h1>
        <p className="text-muted-foreground">Suivez l'avancement de vos dossiers et ajoutez vos documents.</p>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucune demande import/export pour le moment.
            </CardContent>
          </Card>
        )}

        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{request.type} • {request.originCountry} → {request.destinationCountry}</span>
                <Badge>{statusLabel[request.status] || request.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{request.vehicleDescription}</p>
              <p className="text-sm">Budget: {new Intl.NumberFormat("fr-FR").format(request.estimatedBudget)} XAF</p>

              <div className="space-y-2">
                <p className="text-sm font-medium">Documents ({request.documents.length})</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {request.documents.map((doc) => (
                    <div key={doc.id} className="text-sm border rounded-lg px-3 py-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{doc.fileName}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="inline-flex">
                  <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => uploadDocument(request.id, e.target.files?.[0])}
                  />
                  <Button type="button" variant="outline" className="gap-2" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      Ajouter un document
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
