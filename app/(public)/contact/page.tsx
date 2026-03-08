"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockCrmApi } from "@/lib/mock-crm"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await mockCrmApi.createContact(form)
      toast.success("Message envoyé avec succès")
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch {
      toast.error("Impossible d'envoyer le message")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground">Parlez-nous de votre besoin, nous vous répondons rapidement.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
              </div>

              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Send className="h-4 w-4" />
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stilles Auto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5" />
              <p>Bonanjo, Douala, Cameroun</p>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5" />
              <p>+237 6 90 00 00 00</p>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5" />
              <p>contact@stillesauto.com</p>
            </div>

            <div className="rounded-lg overflow-hidden border mt-4">
              <iframe
                title="Carte Douala"
                src="https://www.openstreetmap.org/export/embed.html?bbox=9.66%2C4.04%2C9.76%2C4.11&layer=mapnik"
                className="w-full h-56"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
