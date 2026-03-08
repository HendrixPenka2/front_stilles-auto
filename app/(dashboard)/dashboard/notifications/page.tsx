"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Car,
  ShoppingBag,
  MessageSquare,
  Info,
  CheckCircle,
  AlertCircle,
  Check,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NotificationType = "order" | "vehicle" | "message" | "info" | "success" | "warning"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Commande confirmée",
    message: "Votre réservation pour la Mercedes Classe E a été confirmée.",
    time: "Il y a 5 minutes",
    read: false,
  },
  {
    id: "2",
    type: "vehicle",
    title: "Véhicule disponible",
    message: "La BMW X5 que vous surveillez est maintenant disponible à la location.",
    time: "Il y a 1 heure",
    read: false,
  },
  {
    id: "3",
    type: "message",
    title: "Nouveau message",
    message: "L'équipe Stilles Auto vous a envoyé un message concernant votre location.",
    time: "Il y a 3 heures",
    read: false,
  },
  {
    id: "4",
    type: "success",
    title: "Paiement reçu",
    message: "Nous avons bien reçu votre paiement de 375 000 XAF.",
    time: "Hier",
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "Rappel",
    message: "Votre location de l'Audi A6 se termine dans 2 jours.",
    time: "Hier",
    read: true,
  },
  {
    id: "6",
    type: "warning",
    title: "Action requise",
    message: "Veuillez mettre à jour vos informations de paiement.",
    time: "Il y a 2 jours",
    read: true,
  },
]

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "order":
      return ShoppingBag
    case "vehicle":
      return Car
    case "message":
      return MessageSquare
    case "info":
      return Info
    case "success":
      return CheckCircle
    case "warning":
      return AlertCircle
    default:
      return Bell
  }
}

function getNotificationColor(type: NotificationType) {
  switch (type) {
    case "order":
      return "bg-primary/10 text-primary"
    case "vehicle":
      return "bg-accent/10 text-accent"
    case "message":
      return "bg-blue-500/10 text-blue-500"
    case "success":
      return "bg-success/10 text-success"
    case "warning":
      return "bg-warning/10 text-warning"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <Bell className="w-7 h-7" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Restez informé de vos activités
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="w-4 h-4 mr-2" />
            Tout marquer lu
          </Button>
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Tout effacer
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Aucune notification</h3>
              <p className="text-muted-foreground text-center">
                Vous n'avez pas de nouvelles notifications
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            const colorClass = getNotificationColor(notification.type)

            return (
              <Card
                key={notification.id}
                className={cn(
                  "border-border/50 transition-all hover:shadow-md",
                  !notification.read && "bg-secondary/30"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        colorClass
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={cn(
                              "font-medium",
                              !notification.read && "font-semibold"
                            )}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>

                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
