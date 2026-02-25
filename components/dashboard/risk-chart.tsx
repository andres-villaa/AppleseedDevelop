"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { mockDonaciones } from "@/lib/data"

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function buildData() {
  const fechas = mockDonaciones.map(d => new Date(d.fecha))
  const maxDate = new Date(Math.max(...fechas.map(f => f.getTime())))

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(maxDate.getFullYear(), maxDate.getMonth() - (5 - i), 1)
    const year = d.getFullYear()
    const month = d.getMonth()

    const enMes = mockDonaciones.filter(don => {
      const f = new Date(don.fecha)
      return f.getFullYear() === year && f.getMonth() === month
    })

    // Donantes únicos en ese mes
    const donantesUnicos = new Set(enMes.map(don => don.donante_id)).size
    // Reportes PLD generados (donaciones que requieren reporte)
    const reportesPLD = enMes.filter(don => don.requiere_reporte_pld).length
    // Reportes ya enviados
    const reportesEnviados = enMes.filter(don => don.reportada_pld).length

    return {
      mes: MONTH_LABELS[month],
      donantes: donantesUnicos,
      reportesPLD,
      reportesEnviados,
    }
  })
}

const data = buildData()

export function RiskChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Donantes vs Reportes PLD
        </CardTitle>
        <CardDescription>
          Donantes activos y reportes de lavado de dinero por mes
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={3} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="var(--color-muted-foreground)"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="var(--color-muted-foreground)"
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-foreground)",
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    donantes: "Donantes activos",
                    reportesPLD: "Requieren reporte PLD",
                    reportesEnviados: "Reportes enviados",
                  }
                  return [value, labels[name] ?? name]
                }}
              />
              <Bar
                dataKey="donantes"
                name="donantes"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="reportesPLD"
                name="reportesPLD"
                fill="var(--color-chart-4)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="reportesEnviados"
                name="reportesEnviados"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-chart-1" />
            <span className="text-xs text-muted-foreground">Donantes activos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-chart-4" />
            <span className="text-xs text-muted-foreground">Requieren reporte PLD</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Reportes enviados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
