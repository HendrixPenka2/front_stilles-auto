"use client"

import { useEffect, useState } from "react"
import { mockCrmApi, type ContactMessage, type ContactStatus, type ImportExportRequest, type ImportExportStatus } from "@/lib/mock-crm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { toast } from "sonner"

const statuses: ContactStatus[] = ["NEW", "READ", "IN_PROGRESS", "RESOLVED"]
const requestStatuses: ImportExportStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "QUOTE_SENT",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
]

export default function AdminContactCrmPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [requests, setRequests] = useState<ImportExportRequest[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ImportExportRequest | null>(null)
  const [previewDocument, setPreviewDocument] = useState<{ name: string; mimeType: string; dataUrl?: string } | null>(null)

  const load = async () => {
    const [contacts, importExport] = await Promise.all([
      mockCrmApi.listAdminContacts(),
      mockCrmApi.listAdminImportExport(),
    ])
    setMessages(contacts)
    setRequests(importExport)
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: ContactStatus) => {
    try {
      await mockCrmApi.updateContactStatus(id, status)
      await load()
    } catch {
      toast.error("Mise à jour impossible")
    }
  }

  const updateRequestStatus = async (id: string, status: ImportExportStatus) => {
    try {
      await mockCrmApi.updateImportExportStatus(id, status)
      await load()
    } catch {
      toast.error("Mise à jour impossible")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CRM • Contact & Import/Export</h1>

      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contact">Messages contact ({messages.length})</TabsTrigger>
          <TabsTrigger value="import-export">Demandes import/export ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span className="truncate">{msg.subject}</span>
                  <Badge>{msg.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm"><strong>{msg.name}</strong> • {msg.email} • {msg.phone || "N/A"}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={msg.status}
                    onChange={(e) => updateStatus(msg.id, e.target.value as ContactStatus)}
                    className="h-10 rounded-lg border border-input bg-background px-3"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <Button variant="outline" className="gap-2" onClick={() => setSelectedMessage(msg)}>
                    <Eye className="h-4 w-4" />
                    Ouvrir le message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span className="truncate">{request.type} • {request.userEmail}</span>
                  <Badge>{request.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{request.vehicleDescription}</p>
                <p className="text-sm">Trajet: {request.originCountry} → {request.destinationCountry}</p>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={request.status}
                    onChange={(e) => updateRequestStatus(request.id, e.target.value as ImportExportStatus)}
                    className="h-10 rounded-lg border border-input bg-background px-3"
                  >
                    {requestStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <Badge variant="outline">Docs: {request.documents.length}</Badge>
                  <Button variant="outline" className="gap-2" onClick={() => setSelectedRequest(request)}>
                    <Eye className="h-4 w-4" />
                    Ouvrir le dossier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail du message</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-3">
              <p className="text-sm"><strong>De:</strong> {selectedMessage.name}</p>
              <p className="text-sm"><strong>Email:</strong> {selectedMessage.email}</p>
              <p className="text-sm"><strong>Téléphone:</strong> {selectedMessage.phone || "N/A"}</p>
              <p className="text-sm"><strong>Sujet:</strong> {selectedMessage.subject}</p>
              <div className="rounded-lg border p-3 text-sm whitespace-pre-wrap">{selectedMessage.message}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail demande import/export</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3">
              <p className="text-sm"><strong>Client:</strong> {selectedRequest.userEmail}</p>
              <p className="text-sm"><strong>Type:</strong> {selectedRequest.type}</p>
              <p className="text-sm"><strong>Trajet:</strong> {selectedRequest.originCountry} → {selectedRequest.destinationCountry}</p>
              <p className="text-sm"><strong>Budget:</strong> {new Intl.NumberFormat("fr-FR").format(selectedRequest.estimatedBudget)} XAF</p>
              <div className="rounded-lg border p-3 text-sm whitespace-pre-wrap">{selectedRequest.vehicleDescription}</div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Documents soumis ({selectedRequest.documents.length})</p>
                {selectedRequest.documents.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun document joint.</p>
                )}
                <div className="space-y-2 max-h-52 overflow-auto pr-1">
                  {selectedRequest.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-lg border p-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.mimeType} • {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setPreviewDocument({
                              name: doc.fileName,
                              mimeType: doc.mimeType,
                              dataUrl: doc.dataUrl,
                            })
                          }
                          disabled={!doc.dataUrl}
                        >
                          Lire
                        </Button>
                        {doc.dataUrl && (
                          <a href={doc.dataUrl} download={doc.fileName}>
                            <Button size="sm" type="button">Télécharger</Button>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewDocument} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lecture document • {previewDocument?.name}</DialogTitle>
          </DialogHeader>
          {previewDocument?.dataUrl ? (
            previewDocument.mimeType.startsWith("image/") ? (
              <img src={previewDocument.dataUrl} alt={previewDocument.name} className="max-h-[70vh] w-full object-contain rounded-lg border" />
            ) : previewDocument.mimeType === "application/pdf" ? (
              <iframe title={previewDocument.name} src={previewDocument.dataUrl} className="h-[70vh] w-full rounded-lg border" />
            ) : (
              <p className="text-sm text-muted-foreground">Prévisualisation indisponible pour ce type de document.</p>
            )
          ) : (
            <p className="text-sm text-muted-foreground">Document non disponible.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
