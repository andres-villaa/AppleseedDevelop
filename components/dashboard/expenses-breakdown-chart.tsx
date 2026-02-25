"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { mockGastos } from "@/lib/data"

const COLORS = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
]

function buildData() {
    const cats = [...new Set(mockGastos.map(g => g.categoria))]
    return cats.map((cat, i) => ({
        name: cat,
        value: mockGastos.filter(g => g.categoria === cat).reduce((s, g) => s + g.monto, 0),
        color: COLORS[i % COLORS.length],
    })).sort((a, b) => b.value - a.value)
}

const data = buildData()
const total = data.reduce((s, d) => s + d.value, 0)

function formatMXN(v: number) {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(v)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0]
    return (
        <div style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--color-foreground)",
        }}>
            <p className="font-semibold">{d.name}</p>
            <p>{formatMXN(d.value)}</p>
            <p className="text-muted-foreground">{((d.value / total) * 100).toFixed(1)}% del total</p>
        </div>
    )
}

export function ExpensesBreakdownChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Gastos por Categoría</CardTitle>
                <CardDescription>Distribución de egresos TOTALES</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 mt-1">
                    {data.map((d) => (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                                <span className="text-muted-foreground">{d.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{formatMXN(d.value)}</span>
                                <span className="text-muted-foreground w-10 text-right">{((d.value / total) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
