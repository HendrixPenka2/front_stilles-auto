import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { TestCredentialsDisplay } from '@/components/test-credentials-display'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Stilles Auto | Location & Vente de Véhicules Premium',
    template: '%s | Stilles Auto',
  },
  description: 'Plateforme premium de vente et location de véhicules et accessoires automobiles. Trouvez votre véhicule idéal parmi notre sélection exclusive.',
  keywords: ['location voiture', 'vente véhicule', 'accessoires auto', 'premium', 'Cameroun', 'XAF'],
  authors: [{ name: 'Stilles Auto' }],
  creator: 'Stilles Auto',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://stillesauto.com',
    title: 'Stilles Auto | Location & Vente de Véhicules Premium',
    description: 'Plateforme premium de vente et location de véhicules et accessoires automobiles.',
    siteName: 'Stilles Auto',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stilles Auto | Location & Vente de Véhicules Premium',
    description: 'Plateforme premium de vente et location de véhicules et accessoires automobiles.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TestCredentialsDisplay />
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              style: {
                fontFamily: 'var(--font-inter)',
              },
            }}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
