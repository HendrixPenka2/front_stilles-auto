"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Utilisateurs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Cette section est prête pour la liste, recherche, rôles et actions utilisateurs.
        </CardContent>
      </Card>
    </div>
  )
}
