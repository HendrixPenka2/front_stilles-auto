import { HeroCarousel } from "@/components/home/hero-carousel"
import { SearchSection } from "@/components/home/search-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedVehicles } from "@/components/home/featured-vehicles"
import { StatsSection } from "@/components/home/stats-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <SearchSection />
      <CategoriesSection />
      <FeaturedVehicles />
      <StatsSection />
      <CTASection />
    </>
  )
}
