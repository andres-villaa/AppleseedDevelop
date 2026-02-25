"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  Shield,
  ArrowRight,
  FileWarning,
  UserCheck,
  ReceiptText,
  FileX,
} from "lucide-react"
import type { AlertaCumplimiento } from "@/lib/types"

const alertas: AlertaCumplimiento[] = [
  {
    alerta_id: 1,
    organizacion_id: "org-001",
    titulo: "Donación inusual detectada",
    mensaje: "Múltiples donaciones por montos que superan el umbral de 645 UMAs en un período de 48 horas. Se requiere reporte a la SHCP.",
    tipo_alerta: "donacion_inusual",
    atendida: false,
    created_at: "2026-02-18",
    donante_nombre: "Global Trading S.A.",
  },
  {
    alerta_id: 2,
    organizacion_id: "org-001",
    titulo: "Documento de expediente vencido",
    mensaje: "La identificación oficial presentada tiene una vigencia expirada desde hace 6 meses. El expediente no puede marcarse como completo.",
    tipo_alerta: "documento_vencido",
    atendida: false,
    created_at: "2026-02-17",
    donante_nombre: "Roberto Sanchez Diaz",
  },
  {
    alerta_id: 3,
    organizacion_id: "org-001",
    titulo: "Donante clasificado como PEP",
    mensaje: "El donante presenta coincidencia con la lista de Personas Políticamente Expuestas. Se requiere diligencia debida reforzada antes de aceptar donaciones.",
    tipo_alerta: "pep",
    atendida: false,
    created_at: "2026-02-16",
    donante_nombre: "Roberto Sanchez Diaz",
  },
  {
    alerta_id: 4,
    organizacion_id: "org-001",
    titulo: "Reporte PLD pendiente de envío",
    mensaje: "Existen 3 donaciones que superan el umbral de reporte y que aún no han sido reportadas al sistema PLD de la SHCP.",
    tipo_alerta: "reporte_pendiente",
    atendida: false,
    created_at: "2026-02-15",
    donante_nombre: undefined,
  },
  {
    alerta_id: 5,
    organizacion_id: "org-001",
    titulo: "Expediente KYC incompleto",
    mensaje: "El expediente del donante no cuenta con comprobante de domicilio vigente ni constancia de situación fiscal.",
    tipo_alerta: "expediente_incompleto",
    atendida: true,
    created_at: "2026-02-14",
    donante_nombre: "Ana Gutierrez Vega",
  },
  {
    alerta_id: 6,
    organizacion_id: "org-001",
    titulo: "Donación inusual — patrón fraccionado",
    mensaje: "Se detectaron 8 donaciones consecutivas por montos justo debajo del umbral de reporte, sugiriendo posible fraccionamiento.",
    tipo_alerta: "donacion_inusual",
    atendida: true,
    created_at: "2026-02-13",
    donante_nombre: "Exportadora Pacific S.A.",
  },
]

function getTipoIcon(tipo: AlertaCumplimiento["tipo_alerta"]) {
  switch (tipo) {
    case "donacion_inusual": return <AlertTriangle className="size-4" />
    case "pep": return <UserCheck className="size-4" />
    case "expediente_incompleto": return <FileWarning className="size-4" />
    case "reporte_pendiente": return <ReceiptText className="size-4" />
    case "documento_vencido": return <FileX className="size-4" />
  }
}

function getTipoLabel(tipo: AlertaCumplimiento["tipo_alerta"]) {
  switch (tipo) {
    case "donacion_inusual": return "Donación Inusual"
    case "pep": return "PEP"
    case "expediente_incompleto": return "Expediente Incompleto"
    case "reporte_pendiente": return "Reporte Pendiente"
    case "documento_vencido": return "Documento Vencido"
  }
}

function getTipoBadge(tipo: AlertaCumplimiento["tipo_alerta"]) {
  switch (tipo) {
    case "donacion_inusual":
      return <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px]">Donación Inusual</Badge>
    case "pep":
      return <Badge variant="outline" className="border-destructive text-destructive text-[10px]">PEP</Badge>
    case "reporte_pendiente":
      return <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10 text-[10px]">Reporte Pendiente</Badge>
    case "expediente_incompleto":
      return <Badge variant="secondary" className="text-[10px]">Expediente Incompleto</Badge>
    case "documento_vencido":
      return <Badge variant="secondary" className="text-[10px]">Documento Vencido</Badge>
  }
}

export default function AlertasPage() {
  const [search, setSearch] = useState("")
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaCumplimiento | null>(null)
  const [tab, setTab] = useState("pendientes")

  const pendientes = alertas.filter(a => !a.atendida)
  const atendidas = alertas.filter(a => a.atendida)
  const current = tab === "pendientes" ? pendientes : atendidas

  const filtered = current.filter((a) =>
    a.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (a.donante_nombre ?? "").toLowerCase().includes(search.toLowerCase()) ||
    getTipoLabel(a.tipo_alerta).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <DashboardHeader
        title="Alertas y Casos"
        description="Monitoreo de alertas de cumplimiento ALD"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold mt-1">{pendientes.length}</p>
              <p className="text-[11px] text-destructive mt-1">Requieren atención</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Donaciones Inusuales</p>
              <p className="text-2xl font-bold mt-1">{alertas.filter(a => a.tipo_alerta === "donacion_inusual" && !a.atendida).length}</p>
              <p className="text-[11px] text-destructive mt-1">Sin atender</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Reportes Pendientes PLD</p>
              <p className="text-2xl font-bold mt-1">{alertas.filter(a => a.tipo_alerta === "reporte_pendiente" && !a.atendida).length}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Por enviar a SHCP</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Atendidas</p>
              <p className="text-2xl font-bold mt-1">{atendidas.length}</p>
              <p className="text-[11px] text-success mt-1">Casos cerrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col gap-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="pendientes">
                  <AlertCircle className="size-3.5 mr-1.5" />
                  Pendientes ({pendientes.length})
                </TabsTrigger>
                <TabsTrigger value="atendidas">
                  <CheckCircle className="size-3.5 mr-1.5" />
                  Atendidas ({atendidas.length})
                </TabsTrigger>
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
                      <p className="text-sm font-medium text-muted-foreground">No se encontraron alertas</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Intenta cambiar los filtros de búsqueda</p>
                    </CardContent>
                  </Card>
                ) : (
                  filtered.map((alerta) => (
                    <Card
                      key={alerta.alerta_id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedAlerta(alerta)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            {getTipoIcon(alerta.tipo_alerta)}
                          </div>
                          <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {getTipoBadge(alerta.tipo_alerta)}
                              {alerta.atendida ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="size-4 text-success" />
                                  <span className="text-xs text-muted-foreground">Atendida</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Clock className="size-4 text-destructive" />
                                  <span className="text-xs text-muted-foreground">Pendiente</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm font-semibold">{alerta.titulo}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">{alerta.mensaje}</p>
                            <div className="flex items-center gap-4 mt-1">
                              {alerta.donante_nombre && (
                                <span className="text-[11px] text-muted-foreground">
                                  Donante: <span className="font-medium text-foreground">{alerta.donante_nombre}</span>
                                </span>
                              )}
                              <span className="text-[11px] text-muted-foreground">{alerta.created_at}</span>
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
        <Dialog open={!!selectedAlerta} onOpenChange={() => setSelectedAlerta(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Detalle de Alerta
                {selectedAlerta && getTipoBadge(selectedAlerta.tipo_alerta)}
              </DialogTitle>
              <DialogDescription>
                {selectedAlerta?.titulo}
              </DialogDescription>
            </DialogHeader>
            {selectedAlerta && (
              <div className="flex flex-col gap-5 pt-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-foreground leading-relaxed">{selectedAlerta.mensaje}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo de Alerta</p>
                    <p className="text-sm font-medium mt-0.5">{getTipoLabel(selectedAlerta.tipo_alerta)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estado</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {selectedAlerta.atendida
                        ? <CheckCircle className="size-4 text-success" />
                        : <Clock className="size-4 text-destructive" />
                      }
                      <span className="text-sm">{selectedAlerta.atendida ? "Atendida" : "Pendiente"}</span>
                    </div>
                  </div>
                  {selectedAlerta.donante_nombre && (
                    <div>
                      <p className="text-xs text-muted-foreground">Donante Asociado</p>
                      <p className="text-sm font-medium mt-0.5">{selectedAlerta.donante_nombre}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Detección</p>
                    <p className="text-sm mt-0.5">{selectedAlerta.created_at}</p>
                  </div>
                </div>

                <Separator />

                {!selectedAlerta.atendida && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold">Notas de Resolución</h4>
                    <Textarea
                      placeholder="Describe las acciones tomadas para atender esta alerta..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedAlerta(null)}>Cerrar</Button>
                  {!selectedAlerta.atendida && (
                    <Button onClick={() => setSelectedAlerta(null)}>
                      <CheckCircle className="mr-2 size-4" />
                      Marcar como Atendida
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}
