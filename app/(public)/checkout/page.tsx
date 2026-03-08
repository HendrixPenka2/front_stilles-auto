"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Smartphone,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  ArrowLeft,
  Lock,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const paymentMethods = [
  {
    id: "card",
    name: "Carte bancaire",
    description: "Visa, Mastercard, etc.",
    icon: CreditCard,
  },
  {
    id: "mobile",
    name: "Mobile Money",
    description: "Orange Money, MTN MoMo",
    icon: Smartphone,
  },
  {
    id: "bank",
    name: "Virement bancaire",
    description: "Paiement sous 24-48h",
    icon: Building2,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " XAF"
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [step, setStep] = useState<"info" | "payment" | "confirm">("info")
  const [acceptTerms, setAcceptTerms] = useState(false)

  const subtotal = 433500
  const taxes = subtotal * 0.1925
  const total = subtotal + taxes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "info") {
      setStep("payment")
    } else if (step === "payment") {
      setStep("confirm")
    }
  }

  if (step === "confirm") {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="border-success/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Commande confirmée</h2>
            <p className="text-muted-foreground mb-6">
              Merci pour votre commande ! Vous recevrez un email de confirmation
              avec tous les détails.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Numéro de commande: <span className="font-mono font-medium">CMD-2024-004</span>
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/dashboard/orders">Voir mes commandes</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/cart">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au panier
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={cn(
                  "flex items-center gap-2",
                  step === "info" ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step === "info"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  1
                </div>
                <span className="font-medium">Informations</span>
              </div>
              <div className="flex-1 h-px bg-border" />
              <div
                className={cn(
                  "flex items-center gap-2",
                  step === "payment" ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step === "payment"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  2
                </div>
                <span className="font-medium">Paiement</span>
              </div>
            </div>

            {step === "info" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations de contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" placeholder="Jean" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" placeholder="Dupont" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6 99 00 00 00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      placeholder="Douala, Cameroun"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Mode de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <label
                            key={method.id}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                              paymentMethod === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <RadioGroupItem value={method.id} />
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                paymentMethod === method.id
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {method.description}
                              </p>
                            </div>
                          </label>
                        )
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {paymentMethod === "card" && (
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Informations de carte
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Date d'expiration</Label>
                          <Input id="expiry" placeholder="MM/AA" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {paymentMethod === "mobile" && (
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Mobile Money
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Numéro de téléphone</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="+237 6 99 00 00 00"
                          required
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vous recevrez une notification pour confirmer le paiement.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    J'accepte les{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      conditions générales de vente
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-4">
              {step === "payment" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("info")}
                >
                  Retour
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1"
                disabled={step === "payment" && !acceptTerms}
              >
                {step === "info" ? (
                  "Continuer vers le paiement"
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Payer {formatPrice(total)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mercedes Classe E (5 jours)</span>
                  <span>{formatPrice(375000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kit de nettoyage x1</span>
                  <span>{formatPrice(25000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Support téléphone x2</span>
                  <span>{formatPrice(17000)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA (19.25%)</span>
                  <span>{formatPrice(taxes)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                <Shield className="w-4 h-4" />
                <span>Paiement sécurisé SSL</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
