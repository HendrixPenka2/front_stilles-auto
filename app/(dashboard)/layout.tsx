"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/lib/stores"
import {
  Heart,
  ShoppingBag,
  FileText,
  User,
  Bell,
  LogOut,
  Menu,
  Car,
  Home,
  ChevronRight,
  Sparkles,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: Home },
  { href: "/dashboard/favorites", label: "Favoris", icon: Heart },
  { href: "/dashboard/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/dashboard/import-export", label: "Suivi Import/Export", icon: FileText },
  { href: "/dashboard/profile", label: "Mon profil", icon: User },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
]

function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <aside className={cn("flex flex-col h-full", className)}>
      <div className="p-6 border-b border-border">
        <Link href="/" className="group flex items-center gap-3 rounded-xl p-2 -m-2 hover:bg-secondary/40 transition-colors relative">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-lg">Stilles Auto</span>
            <p className="text-xs text-primary flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" />
              Retour au site
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading, fetchUser, user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col border-r border-border bg-card">
        <DashboardSidebar />
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-4 border-b border-border bg-card/95 backdrop-blur px-4 py-4 lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>

        <Link href="/" className="group flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-secondary/40 transition-colors relative">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Car className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold">Stilles Auto</span>
            <p className="text-[10px] text-primary leading-none animate-pulse">Retour au site</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="hidden lg:flex items-center justify-between border-b border-border bg-card px-8 py-4">
          <div />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
