import Link from "next/link"
import { Car } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between text-primary-foreground p-10 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80"
          alt="Luxury car"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80" />

        <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">Stilles Auto</span>
        </Link>
        </div>
        
        <div className="space-y-6 relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed opacity-90">
              &ldquo;La meilleure expérience de location de véhicules que j&apos;ai eue. 
              Service impeccable, véhicules premium et équipe professionnelle.&rdquo;
            </p>
            <footer className="text-sm opacity-70">
              — Jean-Pierre K., Client fidèle depuis 2020
            </footer>
          </blockquote>
        </div>

        <p className="text-sm opacity-70 relative z-10">
          &copy; {new Date().getFullYear()} Stilles Auto. Tous droits réservés.
        </p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Stilles Auto</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}
