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
    Cell,
} from "recharts"
import type { Donante } from "@/lib/types"

function formatMXN(v: number) {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`
    return `$${v}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
        <div style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--color-foreground)",
        }}>
            <p className="font-semibold mb-1">{label}</p>
            <p>Donación acum.: <span className="font-medium">{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(d.monto)}</span></p>
            {d.es_pep && <p className="text-destructive text-[11px] mt-1">⚠ Persona Políticamente Expuesta</p>}
        </div>
    )
}

export function TopDonorsChart({ donantes }: { donantes: Donante[] }) {
    const data = [...donantes]
        .sort((a, b) => Number(b.donacion_acumulada) - Number(a.donacion_acumulada))
        .slice(0, 6)
        .map((d, i) => ({
            nombre: d.nombre_razon_social.length > 18
                ? d.nombre_razon_social.slice(0, 18) + "…"
                : d.nombre_razon_social,
            monto: Number(d.donacion_acumulada),
            es_pep: d.es_pep,
            color: i === 0
                ? "var(--color-chart-1)"
                : i === 1
                    ? "var(--color-chart-2)"
                    : i === 2
                        ? "var(--color-chart-3)"
                        : "var(--color-muted-foreground)",
        }))

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Top Donantes por Monto Acumulado</CardTitle>
                <CardDescription>Los 6 donantes con mayor aportación histórica</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
                            barCategoryGap="25%"
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="var(--color-border)"
                            />
                            <XAxis
                                type="number"
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                tickFormatter={formatMXN}
                                stroke="var(--color-muted-foreground)"
                            />
                            <YAxis
                                type="category"
                                dataKey="nombre"
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                width={130}
                                stroke="var(--color-muted-foreground)"
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                            <Bar dataKey="monto" name="Donación acumulada" radius={[0, 4, 4, 0]}>
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
