"use client"

import Link from "next/link"
import { Car, Key, Wrench, Gauge, ShieldCheck, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  {
    name: "Location",
    description: "Louez le véhicule parfait",
    icon: Key,
    href: "/vehicles?type=RENTAL",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Vente",
    description: "Achetez votre véhicule",
    icon: Car,
    href: "/vehicles?type=SALE_ONLY",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Accessoires",
    description: "Équipez votre auto",
    icon: Wrench,
    href: "/accessories",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    name: "SUV & 4x4",
    description: "Puissance et confort",
    icon: Truck,
    href: "/vehicles?category=SUV",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    name: "Sport",
    description: "Performance pure",
    icon: Gauge,
    href: "/vehicles?category=SPORT",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    name: "Premium",
    description: "Luxe et élégance",
    icon: ShieldCheck,
    href: "/vehicles?category=LUXURY",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Explorez Nos Catégories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trouvez exactement ce que vous cherchez parmi notre large sélection 
            de véhicules et accessoires automobiles.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative flex flex-col items-center p-6 rounded-2xl border bg-card text-card-foreground transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
            >
              <div className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110",
                category.color
              )}>
                <category.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-center">{category.name}</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
