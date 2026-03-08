"use client"

import { useEffect, useState } from "react"
import { mockCrmApi, type ImportExportRequest, type ImportExportStatus } from "@/lib/mock-crm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const statuses: ImportExportStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "QUOTE_SENT",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
]

export default function AdminImportExportCrmPage() {
  const [requests, setRequests] = useState<ImportExportRequest[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})

  const load = async () => {
    const data = await mockCrmApi.listAdminImportExport()
    setRequests(data)
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: ImportExportStatus) => {
    await mockCrmApi.updateImportExportStatus(id, status)
    await load()
  }

  const addComment = async (id: string) => {
    const value = notes[id]?.trim()
    if (!value) return
    try {
      await mockCrmApi.addInternalComment(id, value, "Admin CRM")
      setNotes((p) => ({ ...p, [id]: "" }))
      await load()
    } catch {
      toast.error("Ajout commentaire impossible")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CRM • Gestion Import / Export</h1>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{request.type} • {request.userEmail}</span>
                <Badge>{request.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{request.vehicleDescription}</p>
              <p className="text-sm">Trajet: {request.originCountry} → {request.destinationCountry}</p>
              <p className="text-sm">Budget: {new Intl.NumberFormat("fr-FR").format(request.estimatedBudget)} XAF</p>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={request.status}
                  onChange={(e) => updateStatus(request.id, e.target.value as ImportExportStatus)}
                  className="h-10 rounded-lg border border-input bg-background px-3"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <Badge variant="outline">Docs: {request.documents.length}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Commentaires internes</p>
                {request.internalComments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border p-2 text-sm">
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={notes[request.id] || ""}
                    onChange={(e) => setNotes((p) => ({ ...p, [request.id]: e.target.value }))}
                    placeholder="Ajouter un commentaire interne"
                  />
                  <Button onClick={() => addComment(request.id)}>Ajouter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
