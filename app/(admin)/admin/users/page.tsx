"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Search, Users } from "lucide-react"
import { toast } from "sonner"
import { MOCK_USERS } from "@/lib/mock-users"
import type { User } from "@/lib/types"

type StoredUser = User & { password?: string }

const REGISTERED_USERS_KEY = "registered_users"

function getStoredUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") {
    return MOCK_USERS
  }

  const rawUsers = localStorage.getItem(REGISTERED_USERS_KEY)

  if (!rawUsers) {
    return MOCK_USERS
  }

  try {
    return JSON.parse(rawUsers) as Record<string, StoredUser>
  } catch {
    return MOCK_USERS
  }
}

function saveStoredUsers(users: Record<string, StoredUser>) {
  if (typeof window === "undefined") return
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
}

function toClients(users: Record<string, StoredUser>) {
  return Object.values(users)
    .filter((user) => user.role === "USER")
    .map((user) => ({
      ...user,
      isActive: user.isActive ?? true,
    }))
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState("")
  const [clients, setClients] = useState<StoredUser[]>([])

  useEffect(() => {
    const users = getStoredUsers()
    const normalizedUsers = Object.fromEntries(
      Object.entries(users).map(([email, user]) => [
        email,
        {
          ...user,
          isActive: user.isActive ?? true,
        },
      ])
    ) as Record<string, StoredUser>

    saveStoredUsers(normalizedUsers)
    setClients(toClients(normalizedUsers))
  }, [])

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return clients

    return clients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase()
      return (
        fullName.includes(normalizedQuery) ||
        client.email.toLowerCase().includes(normalizedQuery) ||
        (client.phone ?? "").toLowerCase().includes(normalizedQuery)
      )
    })
  }, [clients, query])

  const stats = useMemo(() => {
    const total = clients.length
    const active = clients.filter((client) => client.isActive).length
    const inactive = total - active

    return { total, active, inactive }
  }, [clients])

  const toggleClientStatus = (clientId: string) => {
    const users = getStoredUsers()
    const userEntry = Object.entries(users).find(([, user]) => user.id === clientId)

    if (!userEntry) {
      toast.error("Client introuvable")
      return
    }

    const [email, user] = userEntry
    const nextStatus = !(user.isActive ?? true)

    users[email] = {
      ...user,
      isActive: nextStatus,
    }

    saveStoredUsers(users)
    setClients(toClients(users))

    toast.success(nextStatus ? "Client activé" : "Client désactivé")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <Users className="w-7 h-7" />
          Gestion des clients
        </h1>
        <p className="text-muted-foreground mt-1">
          Activez ou désactivez les comptes clients depuis la section utilisateurs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total clients</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Actifs</p>
            <p className="text-2xl font-bold text-success">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Désactivés</p>
            <p className="text-2xl font-bold text-destructive">{stats.inactive}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="space-y-4">
          <CardTitle>Liste des clients</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher par nom, email ou téléphone..."
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredClients.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Aucun client trouvé pour ce filtre.
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl border border-border/50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{client.firstName} {client.lastName}</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {client.phone ? `+237 ${client.phone}` : "Téléphone non renseigné"}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <Badge
                    className={
                      client.isActive
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {client.isActive ? "Actif" : "Désactivé"}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={client.isActive}
                      onCheckedChange={() => toggleClientStatus(client.id)}
                      aria-label={`Activer ou désactiver ${client.firstName} ${client.lastName}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleClientStatus(client.id)}
                    >
                      {client.isActive ? "Désactiver" : "Activer"}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
