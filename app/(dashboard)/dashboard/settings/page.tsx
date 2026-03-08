"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      <Card>
        <CardHeader>
          <CardTitle>Préférences utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Cette section peut recevoir les préférences de compte, notifications et confidentialité.
        </CardContent>
      </Card>
    </div>
  )
}
