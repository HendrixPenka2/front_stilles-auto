"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    title: "Découvrez l'Excellence Automobile",
    subtitle: "Location & Vente de Véhicules Premium",
    description: "Explorez notre collection exclusive de véhicules haut de gamme. Location courte ou longue durée, ou achetez le véhicule de vos rêves.",
    cta: { text: "Voir les véhicules", href: "/vehicles" },
    ctaSecondary: { text: "En savoir plus", href: "/about" },
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
    overlay: "from-background/90 via-background/60 to-transparent",
  },
  {
    id: 2,
    title: "Location Flexible",
    subtitle: "Adaptée à Vos Besoins",
    description: "Que ce soit pour un week-end ou plusieurs mois, nos tarifs flexibles s'adaptent à votre budget et vos envies.",
    cta: { text: "Louer maintenant", href: "/vehicles?type=RENTAL" },
    ctaSecondary: { text: "Voir les tarifs", href: "/pricing" },
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80",
    overlay: "from-background/90 via-background/60 to-transparent",
  },
  {
    id: 3,
    title: "Accessoires Premium",
    subtitle: "Pour Sublimer Votre Véhicule",
    description: "Découvrez notre gamme complète d'accessoires automobiles de qualité pour personnaliser et entretenir votre véhicule.",
    cta: { text: "Voir les accessoires", href: "/accessories" },
    ctaSecondary: { text: "Guide d'achat", href: "/guide" },
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80",
    overlay: "from-background/90 via-background/60 to-transparent",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)

  React.useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)
  }

  const goToNext = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  return (
    <section className="relative h-[90vh] min-h-[600px] max-h-[900px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Overlay */}
          <div className={cn("absolute inset-0 bg-gradient-to-r", slide.overlay)} />

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <span 
                className={cn(
                  "inline-block text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4 transition-all duration-700 delay-100",
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {slide.subtitle}
              </span>
              <h1 
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 transition-all duration-700 delay-200",
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {slide.title}
              </h1>
              <p 
                className={cn(
                  "text-lg text-muted-foreground max-w-xl mb-8 transition-all duration-700 delay-300",
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {slide.description}
              </p>
              <div 
                className={cn(
                  "flex flex-wrap gap-4 transition-all duration-700 delay-400",
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <Button size="lg" className="gap-2 rounded-full px-8" asChild>
                  <Link href={slide.cta.href}>
                    {slide.cta.text}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                  <Link href={slide.ctaSecondary.href}>
                    {slide.ctaSecondary.text}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Précédent</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Suivant</span>
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "w-8 bg-primary" 
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            )}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
