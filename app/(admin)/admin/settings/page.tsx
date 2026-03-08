"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres admin</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuration plateforme</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Zone prévue pour paramètres business, notifications, sécurité et préférences CRM.
        </CardContent>
      </Card>
    </div>
  )
}
