"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  ArrowRight,
  Filter,
} from "lucide-react"

interface Alert {
  id: string
  titulo: string
  descripcion: string
  tipo: "transaccion" | "documento" | "comportamiento" | "lista_negra"
  severidad: "critica" | "alta" | "media" | "baja"
  estado: "nueva" | "en_investigacion" | "resuelta" | "descartada"
  registro: string
  fecha: string
  asignado: string
}

const alerts: Alert[] = [
  {
    id: "ALT-001",
    titulo: "Transaccion inusual detectada",
    descripcion: "Multiples transferencias internacionales por montos que superan el umbral de $50,000 USD en un periodo de 48 horas.",
    tipo: "transaccion",
    severidad: "critica",
    estado: "nueva",
    registro: "Global Trading S.A.",
    fecha: "2026-02-18",
    asignado: "Maria Alvarez",
  },
  {
    id: "ALT-002",
    titulo: "Documento vencido",
    descripcion: "La identificacion oficial presentada tiene una vigencia expirada desde hace 6 meses.",
    tipo: "documento",
    severidad: "media",
    estado: "en_investigacion",
    registro: "Roberto Sanchez Diaz",
    fecha: "2026-02-17",
    asignado: "Luis Torres",
  },
  {
    id: "ALT-003",
    titulo: "Coincidencia en lista PEP",
    descripcion: "El beneficiario final presenta coincidencia parcial con una persona politicamente expuesta.",
    tipo: "lista_negra",
    severidad: "alta",
    estado: "en_investigacion",
    registro: "Inversiones del Norte S.A.",
    fecha: "2026-02-16",
    asignado: "Maria Alvarez",
  },
  {
    id: "ALT-004",
    titulo: "Patron de fraccionamiento",
    descripcion: "Se detectaron 12 depositos consecutivos por montos justo debajo del umbral de reporte.",
    tipo: "comportamiento",
    severidad: "alta",
    estado: "nueva",
    registro: "Ana Gutierrez Vega",
    fecha: "2026-02-15",
    asignado: "Sin asignar",
  },
  {
    id: "ALT-005",
    titulo: "Documentacion KYC incompleta",
    descripcion: "El expediente del cliente no cuenta con comprobante de domicilio vigente ni constancia fiscal.",
    tipo: "documento",
    severidad: "baja",
    estado: "resuelta",
    registro: "Tech Solutions Mexico",
    fecha: "2026-02-14",
    asignado: "Luis Torres",
  },
  {
    id: "ALT-006",
    titulo: "Actividad fuera de perfil",
    descripcion: "Operaciones por $2.3M MXN que no corresponden al perfil transaccional declarado.",
    tipo: "transaccion",
    severidad: "critica",
    estado: "nueva",
    registro: "Exportadora Pacific S.A.",
    fecha: "2026-02-13",
    asignado: "Maria Alvarez",
  },
]

function getSeverityBadge(severidad: Alert["severidad"]) {
  switch (severidad) {
    case "critica":
      return <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px]">Critica</Badge>
    case "alta":
      return <Badge variant="outline" className="border-destructive text-destructive text-[10px]">Alta</Badge>
    case "media":
      return <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10 text-[10px]">Media</Badge>
    case "baja":
      return <Badge variant="secondary" className="text-[10px]">Baja</Badge>
  }
}

function getStatusIcon(estado: Alert["estado"]) {
  switch (estado) {
    case "nueva":
      return <AlertCircle className="size-4 text-destructive" />
    case "en_investigacion":
      return <Clock className="size-4 text-primary" />
    case "resuelta":
      return <CheckCircle className="size-4 text-success" />
    case "descartada":
      return <XCircle className="size-4 text-muted-foreground" />
  }
}

function getStatusLabel(estado: Alert["estado"]) {
  switch (estado) {
    case "nueva":
      return "Nueva"
    case "en_investigacion":
      return "En Investigacion"
    case "resuelta":
      return "Resuelta"
    case "descartada":
      return "Descartada"
  }
}

function getTypeIcon(tipo: Alert["tipo"]) {
  switch (tipo) {
    case "transaccion":
      return <AlertTriangle className="size-4" />
    case "documento":
      return <AlertCircle className="size-4" />
    case "comportamiento":
      return <Shield className="size-4" />
    case "lista_negra":
      return <AlertTriangle className="size-4" />
  }
}

const alertCounts = {
  todas: alerts.length,
  nuevas: alerts.filter((a) => a.estado === "nueva").length,
  investigacion: alerts.filter((a) => a.estado === "en_investigacion").length,
  resueltas: alerts.filter((a) => a.estado === "resuelta" || a.estado === "descartada").length,
}

export default function AlertasPage() {
  const [search, setSearch] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [tab, setTab] = useState("todas")

  const filtered = alerts.filter((a) => {
    const matchSearch =
      a.titulo.toLowerCase().includes(search.toLowerCase()) ||
      a.registro.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())

    if (tab === "todas") return matchSearch
    if (tab === "nuevas") return matchSearch && a.estado === "nueva"
    if (tab === "investigacion") return matchSearch && a.estado === "en_investigacion"
    if (tab === "resueltas") return matchSearch && (a.estado === "resuelta" || a.estado === "descartada")
    return matchSearch
  })

  return (
    <>
      <DashboardHeader
        title="Alertas y Casos"
        description="Monitoreo y gestion de alertas ALD"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Alertas Nuevas</p>
              <p className="text-2xl font-bold mt-1">{alertCounts.nuevas}</p>
              <p className="text-[11px] text-destructive mt-1">Requieren atencion inmediata</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">En Investigacion</p>
              <p className="text-2xl font-bold mt-1">{alertCounts.investigacion}</p>
              <p className="text-[11px] text-primary mt-1">Casos en proceso</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Resueltas</p>
              <p className="text-2xl font-bold mt-1">{alertCounts.resueltas}</p>
              <p className="text-[11px] text-success mt-1">Casos cerrados</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total del Mes</p>
              <p className="text-2xl font-bold mt-1">{alertCounts.todas}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Febrero 2026</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col gap-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="todas">Todas ({alertCounts.todas})</TabsTrigger>
                <TabsTrigger value="nuevas">Nuevas ({alertCounts.nuevas})</TabsTrigger>
                <TabsTrigger value="investigacion">En Investigacion ({alertCounts.investigacion})</TabsTrigger>
                <TabsTrigger value="resueltas">Resueltas ({alertCounts.resueltas})</TabsTrigger>
              </TabsList>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar alertas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <TabsContent value={tab} className="mt-4">
              <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Shield className="size-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No se encontraron alertas
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Intenta cambiar los filtros de busqueda
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filtered.map((alert) => (
                    <Card
                      key={alert.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            {getTypeIcon(alert.tipo)}
                          </div>
                          <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {alert.id}
                              </span>
                              {getSeverityBadge(alert.severidad)}
                              <div className="flex items-center gap-1">
                                {getStatusIcon(alert.estado)}
                                <span className="text-xs text-muted-foreground">
                                  {getStatusLabel(alert.estado)}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">
                              {alert.titulo}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {alert.descripcion}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-[11px] text-muted-foreground">
                                Registro: <span className="font-medium text-foreground">{alert.registro}</span>
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {alert.fecha}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                Asignado: {alert.asignado}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0 size-8">
                            <ArrowRight className="size-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Alert Detail Dialog */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>Detalle de Alerta</span>
                {selectedAlert && getSeverityBadge(selectedAlert.severidad)}
              </DialogTitle>
              <DialogDescription>
                {selectedAlert?.id} - {selectedAlert?.titulo}
              </DialogDescription>
            </DialogHeader>
            {selectedAlert && (
              <div className="flex flex-col gap-5 pt-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedAlert.descripcion}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo de Alerta</p>
                    <p className="text-sm font-medium mt-0.5 capitalize">{selectedAlert.tipo.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estado</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {getStatusIcon(selectedAlert.estado)}
                      <span className="text-sm">{getStatusLabel(selectedAlert.estado)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Registro Asociado</p>
                    <p className="text-sm font-medium mt-0.5">{selectedAlert.registro}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Deteccion</p>
                    <p className="text-sm mt-0.5">{selectedAlert.fecha}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Asignado a</p>
                    <p className="text-sm mt-0.5">{selectedAlert.asignado}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-semibold">Acciones</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <Label>Cambiar Estado</Label>
                      <Select defaultValue={selectedAlert.estado}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nueva">Nueva</SelectItem>
                          <SelectItem value="en_investigacion">En Investigacion</SelectItem>
                          <SelectItem value="resuelta">Resuelta</SelectItem>
                          <SelectItem value="descartada">Descartada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Reasignar</Label>
                      <Select defaultValue="maria">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maria">Maria Alvarez</SelectItem>
                          <SelectItem value="luis">Luis Torres</SelectItem>
                          <SelectItem value="ana">Ana Garcia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Notas de Investigacion</Label>
                    <Textarea
                      placeholder="Escribe las notas de la investigacion aqui..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => setSelectedAlert(null)}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
