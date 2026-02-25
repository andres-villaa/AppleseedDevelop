"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { mockDonaciones } from "@/lib/data"

// Nombres cortos de mes en español
const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

// Agrupa donaciones por mes (últimos 6 meses desde la fecha más reciente)
function buildMonthlyData() {
  // Fecha de referencia: mes más reciente en los datos
  const fechas = mockDonaciones.map(d => new Date(d.fecha))
  const maxDate = new Date(Math.max(...fechas.map(f => f.getTime())))

  // Generar los 6 meses hacia atrás
  const months: { mes: string; monto: number; cantidad: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(maxDate.getFullYear(), maxDate.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth() // 0-indexed

    const enMes = mockDonaciones.filter(don => {
      const f = new Date(don.fecha)
      return f.getFullYear() === year && f.getMonth() === month
    })

    months.push({
      mes: MONTH_LABELS[month],
      monto: enMes.reduce((s, don) => s + don.monto, 0),
      cantidad: enMes.length,
    })
  }
  return months
}

const data = buildMonthlyData()

function formatMXN(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`
  return `$${value}`
}

export function ComplianceChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Donaciones por Mes
        </CardTitle>
        <CardDescription>
          Monto total recaudado en los últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
                tickFormatter={formatMXN}
                stroke="var(--color-muted-foreground)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-foreground)",
                }}
                formatter={(value: number, _: string, entry) => [
                  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(value),
                  `Monto (${entry.payload.cantidad} donación${entry.payload.cantidad !== 1 ? "es" : ""})`,
                ]}
              />
              <Line
                type="monotone"
                dataKey="monto"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-chart-1)", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
