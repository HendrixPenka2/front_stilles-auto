"use client"

import { Car, Users, Star, Award } from "lucide-react"

const stats = [
  {
    icon: Car,
    value: "150+",
    label: "Véhicules disponibles",
    description: "Flotte variée et premium",
  },
  {
    icon: Users,
    value: "5000+",
    label: "Clients satisfaits",
    description: "Depuis notre création",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Note moyenne",
    description: "Basée sur les avis",
  },
  {
    icon: Award,
    value: "10+",
    label: "Années d'expérience",
    description: "Au service de l'excellence",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="font-medium text-foreground mb-1">{stat.label}</div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
