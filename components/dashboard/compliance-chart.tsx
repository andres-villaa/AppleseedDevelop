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

const data = [
  { mes: "Sep", cumplimiento: 88.2 },
  { mes: "Oct", cumplimiento: 89.5 },
  { mes: "Nov", cumplimiento: 91.3 },
  { mes: "Dic", cumplimiento: 90.1 },
  { mes: "Ene", cumplimiento: 93.4 },
  { mes: "Feb", cumplimiento: 94.7 },
]

export function ComplianceChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Tasa de Cumplimiento
        </CardTitle>
        <CardDescription>
          Porcentaje de cumplimiento mensual
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
                domain={[85, 100]}
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
                formatter={(value: number) => [`${value}%`, "Cumplimiento"]}
              />
              <Line
                type="monotone"
                dataKey="cumplimiento"
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
