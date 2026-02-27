"use client"

import { Card, CardContent } from "@/components/ui/card"
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
  Calculator,
} from "lucide-react"
import type { Donante, Donacion, Gasto } from "@/lib/types"

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount)
}

// ─── Shared StatCard component ─────────────────────────────────────────────────

type StatItem = {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  color: string
}

function StatRow({ stats }: { stats: StatItem[] }) {
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

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 text-muted-foreground" />
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <Separator className="flex-1" />
    </div>
  )
}

// ─── Exported section components ──────────────────────────────────────────────

export function DonantesKPI({ donantes }: { donantes: Donante[] }) {
  const totalDonantes = donantes.length
  const expedientesCompletos = donantes.filter(d => d.estatus_expediente === "completo").length
  const expedientesIncompletos = donantes.filter(d => d.estatus_expediente !== "completo").length
  const donantesPEP = donantes.filter(d => d.es_pep).length

  return (
    <div className="flex flex-col gap-3">
      <SectionHeader icon={Users} label="Donantes" />
      <StatRow stats={[
        { label: "Total Donantes", value: totalDonantes.toString(), sub: "registrados", icon: Users, color: "bg-primary/10 text-primary" },
        { label: "Expedientes Completos", value: expedientesCompletos.toString(), sub: `${totalDonantes > 0 ? Math.round((expedientesCompletos / totalDonantes) * 100) : 0}% del total`, icon: UserCheck, color: "bg-success/10 text-success" },
        { label: "Expedientes Pendientes", value: expedientesIncompletos.toString(), sub: "incompletos o en revisión", icon: UserX, color: "bg-warning/10 text-warning-foreground" },
        { label: "Donantes PEP", value: donantesPEP.toString(), sub: "diligencia reforzada", icon: ShieldAlert, color: "bg-destructive/10 text-destructive" },
      ]} />
    </div>
  )
}

export function DonacionesKPI({ donaciones, umaActual }: { donaciones: Donacion[], umaActual: { uma_id: number; year: number; valor: number } }) {
  const totalRecaudado = donaciones.reduce((s, d) => s + Number(d.monto), 0)
  const donacionesRequierenPLD = donaciones.filter(d => d.requiere_reporte_pld).length
  const donacionesPendientesPLD = donaciones.filter(d => d.requiere_reporte_pld && !d.reportada_pld).length
  const donacionesReportadasSAT = donaciones.filter(d => d.reportada_sat).length
  const umbralPLD = 645 * (umaActual?.valor || 108.57)

  return (
    <div className="flex flex-col gap-3">
      <SectionHeader icon={TrendingUp} label="Donaciones" />
      <StatRow stats={[
        {
          label: "Valor UMA Diario",
          value: formatMXN(umaActual?.valor || 117.31),
          sub: `Año ${umaActual?.year || new Date().getFullYear()}`,
          icon: Calculator,
          color: "bg-muted text-muted-foreground"
        },
        { label: "Total Recaudado", value: formatMXN(totalRecaudado), sub: `${donaciones.length} donaciones`, icon: TrendingUp, color: "bg-primary/10 text-primary" },
        { label: "Requieren Reporte PLD", value: donacionesRequierenPLD.toString(), sub: `≥ 645 UMAs (${formatMXN(umbralPLD)})`, icon: FileWarning, color: "bg-destructive/10 text-destructive" },
        { label: "Reportadas SAT", value: donacionesReportadasSAT.toString(), sub: `${donaciones.length - donacionesReportadasSAT} pendientes`, icon: CircleCheck, color: "bg-success/10 text-success" },
      ]} />
    </div>
  )
}

export function GastosKPI({ gastos }: { gastos: Gasto[] }) {
  const totalGastado = gastos.reduce((s, g) => s + Number(g.monto), 0)
  const gastosPorCategoria = [...new Set(gastos.map(g => g.categoria))].map(cat => ({
    cat,
    total: gastos.filter(g => g.categoria === cat).reduce((s, g) => s + Number(g.monto), 0),
  })).sort((a, b) => b.total - a.total)

  return (
    <div className="flex flex-col gap-3">
      <SectionHeader icon={Wallet} label="Gastos" />
      <StatRow stats={[
        { label: "Total Gastado", value: formatMXN(totalGastado), sub: `${gastos.length} registros`, icon: Wallet, color: "bg-primary/10 text-primary" },
        ...gastosPorCategoria.slice(0, 3).map(({ cat, total }) => ({
          label: cat,
          value: formatMXN(total),
          sub: `${gastos.filter(g => g.categoria === cat).length} registros`,
          icon: Receipt,
          color: "bg-muted text-muted-foreground",
        })),
      ]} />
    </div>
  )
}
