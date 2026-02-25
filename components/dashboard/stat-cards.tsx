"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  TrendingUp,
  FileWarning,
  CircleCheck,
  Wallet,
  Receipt,
} from "lucide-react"
import {
  mockDonantes,
  mockDonaciones,
  mockGastos,
  umaActual,
} from "@/lib/data"

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount)
}

// ─── Donantes ──────────────────────────────────────────────────────────────────
const totalDonantes = mockDonantes.length
const expedientesCompletos = mockDonantes.filter(d => d.estatus_expediente === "completo").length
const expedientesIncompletos = mockDonantes.filter(d => d.estatus_expediente !== "completo").length
const donantesPEP = mockDonantes.filter(d => d.es_pep).length

// ─── Donaciones ────────────────────────────────────────────────────────────────
const totalRecaudado = mockDonaciones.reduce((s, d) => s + d.monto, 0)
const donacionesRequierenPLD = mockDonaciones.filter(d => d.requiere_reporte_pld).length
const donacionesPendientesPLD = mockDonaciones.filter(d => d.requiere_reporte_pld && !d.reportada_pld).length
const donacionesReportadasSAT = mockDonaciones.filter(d => d.reportada_sat).length
const umbralPLD = 645 * umaActual.valor

// ─── Gastos ────────────────────────────────────────────────────────────────────
const totalGastado = mockGastos.reduce((s, g) => s + g.monto, 0)
const gastosPorCategoria = [...new Set(mockGastos.map(g => g.categoria))].map(cat => ({
  cat,
  total: mockGastos.filter(g => g.categoria === cat).reduce((s, g) => s + g.monto, 0),
})).sort((a, b) => b.total - a.total)

// ─── Sections ─────────────────────────────────────────────────────────────────

const donanteStats = [
  {
    label: "Total Donantes",
    value: totalDonantes.toString(),
    sub: "registrados",
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Expedientes Completos",
    value: expedientesCompletos.toString(),
    sub: `${Math.round((expedientesCompletos / totalDonantes) * 100)}% del total`,
    icon: UserCheck,
    color: "bg-success/10 text-success",
  },
  {
    label: "Expedientes Pendientes",
    value: expedientesIncompletos.toString(),
    sub: "incompletos o en revisión",
    icon: UserX,
    color: "bg-warning/10 text-warning-foreground",
  },
  {
    label: "Donantes PEP",
    value: donantesPEP.toString(),
    sub: "diligencia reforzada",
    icon: ShieldAlert,
    color: "bg-destructive/10 text-destructive",
  },
]

const donacionStats = [
  {
    label: "Total Recaudado",
    value: formatMXN(totalRecaudado),
    sub: `${mockDonaciones.length} donaciones`,
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Requieren Reporte PLD",
    value: donacionesRequierenPLD.toString(),
    sub: `≥ 645 UMAs (${formatMXN(umbralPLD)})`,
    icon: FileWarning,
    color: "bg-warning/10 text-warning-foreground",
  },
  {
    label: "Pendientes PLD",
    value: donacionesPendientesPLD.toString(),
    sub: "sin reportar a SHCP",
    icon: FileWarning,
    color: "bg-destructive/10 text-destructive",
  },
  {
    label: "Reportadas SAT",
    value: donacionesReportadasSAT.toString(),
    sub: `${mockDonaciones.length - donacionesReportadasSAT} pendientes`,
    icon: CircleCheck,
    color: "bg-success/10 text-success",
  },
]

const gastoStats = [
  {
    label: "Total Gastado",
    value: formatMXN(totalGastado),
    sub: `${mockGastos.length} registros`,
    icon: Wallet,
    color: "bg-primary/10 text-primary",
  },
  ...gastosPorCategoria.slice(0, 3).map(({ cat, total }) => ({
    label: cat,
    value: formatMXN(total),
    sub: `${mockGastos.filter(g => g.categoria === cat).length} registros`,
    icon: Receipt,
    color: "bg-muted text-muted-foreground",
  })),
]

function StatRow({
  stats,
}: {
  stats: { label: string; value: string; sub: string; icon: React.ElementType; color: string }[]
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground leading-snug">{s.label}</p>
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-md ${s.color}`}>
                <s.icon className="size-3.5" />
              </div>
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function StatCards() {
  return (
    <div className="flex flex-col gap-5">
      {/* Donantes */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="size-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Donantes</p>
          <Separator className="flex-1" />
        </div>
        <StatRow stats={donanteStats} />
      </div>

      {/* Donaciones */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="size-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Donaciones</p>
          <Separator className="flex-1" />
        </div>
        <StatRow stats={donacionStats} />
      </div>

      {/* Gastos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="size-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Gastos</p>
          <Separator className="flex-1" />
        </div>
        <StatRow stats={gastoStats} />
      </div>
    </div>
  )
}
