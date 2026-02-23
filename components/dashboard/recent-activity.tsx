"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, UserPlus, AlertTriangle, CheckCircle, Upload } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "registro",
    title: "Nuevo registro creado",
    description: "Empresa Global Trading S.A. registrada para verificacion",
    time: "Hace 15 min",
    icon: UserPlus,
    status: "nuevo",
  },
  {
    id: 2,
    type: "documento",
    title: "Documento subido",
    description: "Acta constitutiva - Inversiones del Norte",
    time: "Hace 32 min",
    icon: Upload,
    status: "pendiente",
  },
  {
    id: 3,
    type: "alerta",
    title: "Alerta de riesgo alto",
    description: "Transaccion inusual detectada en cuenta #4892",
    time: "Hace 1 hr",
    icon: AlertTriangle,
    status: "urgente",
  },
  {
    id: 4,
    type: "verificacion",
    title: "Verificacion completada",
    description: "KYC aprobado para Carlos Mendez Rodriguez",
    time: "Hace 2 hr",
    icon: CheckCircle,
    status: "completado",
  },
  {
    id: 5,
    type: "documento",
    title: "Reporte generado",
    description: "Reporte trimestral ALD Q4 2025",
    time: "Hace 3 hr",
    icon: FileText,
    status: "completado",
  },
  {
    id: 6,
    type: "registro",
    title: "Registro actualizado",
    description: "Informacion de beneficiario final - Tech Solutions",
    time: "Hace 4 hr",
    icon: UserPlus,
    status: "pendiente",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "nuevo":
      return <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">Nuevo</Badge>
    case "pendiente":
      return <Badge variant="secondary" className="text-[10px]">Pendiente</Badge>
    case "urgente":
      return <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px]">Urgente</Badge>
    case "completado":
      return <Badge variant="outline" className="border-success text-success text-[10px]">Completado</Badge>
    default:
      return null
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Actividad Reciente
        </CardTitle>
        <CardDescription>
          Ultimas acciones en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[380px]">
          <div className="flex flex-col">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 border-b px-5 py-3.5 last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <activity.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
