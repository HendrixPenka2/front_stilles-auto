"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytiques</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tableaux de bord analytiques</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Section en place pour KPI, graphiques revenus, conversion et performance catalogue.
        </CardContent>
      </Card>
    </div>
  )
}
