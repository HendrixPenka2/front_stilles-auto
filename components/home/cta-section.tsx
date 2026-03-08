import Link from "next/link"
import { ArrowRight, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Prêt à Vivre l&apos;Expérience Stilles Auto ?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Que vous cherchiez à louer ou acheter, notre équipe est à votre disposition 
            pour vous accompagner dans votre projet automobile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2 rounded-full px-8"
              asChild
            >
              <Link href="/vehicles">
                Explorer les véhicules
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 rounded-full px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/contact">
                <MessageCircle className="h-5 w-5" />
                Nous contacter
              </Link>
            </Button>
          </div>
          
          {/* Quick Contact */}
          <div className="mt-10 pt-10 border-t border-primary-foreground/20">
            <p className="text-sm opacity-70 mb-3">Besoin d&apos;aide immédiate ?</p>
            <a 
              href="tel:+237600000000" 
              className="inline-flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity"
            >
              <Phone className="h-5 w-5" />
              +237 6XX XXX XXX
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
