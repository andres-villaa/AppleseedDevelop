"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const stats = [
  {
    title: "Registros Totales",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    description: "vs. mes anterior",
  },
  {
    title: "Documentos Verificados",
    value: "1,923",
    change: "+8.2%",
    trend: "up" as const,
    icon: FileCheck,
    description: "vs. mes anterior",
  },
  {
    title: "Alertas Activas",
    value: "23",
    change: "-15.3%",
    trend: "down" as const,
    icon: AlertTriangle,
    description: "vs. mes anterior",
  },
  {
    title: "Tasa de Cumplimiento",
    value: "94.7%",
    change: "+2.1%",
    trend: "up" as const,
    icon: ShieldCheck,
    description: "vs. mes anterior",
  },
]

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="size-4 text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3.5 text-success" />
                ) : (
                  <TrendingDown className="size-3.5 text-success" />
                )}
                <span className="text-xs font-medium text-success">
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
