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

const data = [
  { mes: "Sep", bajo: 120, medio: 45, alto: 12 },
  { mes: "Oct", bajo: 135, medio: 52, alto: 8 },
  { mes: "Nov", bajo: 148, medio: 38, alto: 15 },
  { mes: "Dic", bajo: 110, medio: 60, alto: 10 },
  { mes: "Ene", bajo: 165, medio: 42, alto: 7 },
  { mes: "Feb", bajo: 172, medio: 35, alto: 5 },
]

export function RiskChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Registros por Nivel de Riesgo
        </CardTitle>
        <CardDescription>
          Distribucion mensual de registros clasificados por nivel de riesgo
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-foreground)",
                }}
              />
              <Bar
                dataKey="bajo"
                name="Bajo"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="medio"
                name="Medio"
                fill="var(--color-chart-3)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="alto"
                name="Alto"
                fill="var(--color-chart-4)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Bajo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-chart-3" />
            <span className="text-xs text-muted-foreground">Medio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-chart-4" />
            <span className="text-xs text-muted-foreground">Alto</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
