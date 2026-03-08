import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">À propos de Stilles Auto</h1>
        <p className="text-muted-foreground max-w-3xl">
          Stilles Auto est une plateforme premium de location, vente et accompagnement import/export
          de véhicules et accessoires automobiles.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent>Rendre la mobilité premium plus simple, sûre et accessible.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent>Devenir la référence automobile digitale en Afrique centrale.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valeurs</CardTitle>
          </CardHeader>
          <CardContent>Transparence, qualité de service, accompagnement client.</CardContent>
        </Card>
      </div>
    </div>
  )
}
