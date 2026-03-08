"use client"

import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Wrench, Power, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const statusOptions = ["available", "rented", "maintenance", "inactive"] as const

type VehicleStatus = (typeof statusOptions)[number]

export default function AdminVehicleActionsPage() {
  const params = useParams<{ id: string }>()
  const [status, setStatus] = useState<VehicleStatus>("maintenance")
  const [reason, setReason] = useState("")

  const saveActions = () => {
    toast.success("Actions véhicule mises à jour")
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/vehicles"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Actions véhicule #{params.id}</h1>
          <p className="text-muted-foreground">Activer, désactiver, modifier la disponibilité et la raison.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Power className="h-5 w-5" />Disponibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Badge variant="outline">Statut actuel: {status}</Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Raison précise</Label>
            <Textarea id="reason" rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex: Maintenance freinage, indisponible 48h..." />
          </div>

          <Button onClick={saveActions} className="gap-2"><Save className="h-4 w-4" />Enregistrer</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" />Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => { setStatus("available"); toast.success("Véhicule activé") }}>Activer</Button>
          <Button variant="outline" onClick={() => { setStatus("inactive"); toast.success("Véhicule désactivé") }}>Désactiver</Button>
          <Button variant="outline" onClick={() => { setStatus("maintenance"); toast.success("Statut maintenance") }}>Mettre en maintenance</Button>
          <Button variant="outline" asChild><Link href={`/admin/vehicles/${params.id}/edit`}>Modifier fiche véhicule</Link></Button>
        </CardContent>
      </Card>
    </div>
  )
}
