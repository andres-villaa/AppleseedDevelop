"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

// Datos simulados de facturación y gastos mensuales
const data = [
    { mes: "Ene", facturacion: 120000, gastos: 90000 },
    { mes: "Feb", facturacion: 135000, gastos: 95000 },
    { mes: "Mar", facturacion: 110000, gastos: 105000 },
    { mes: "Abr", facturacion: 150000, gastos: 100000 },
    { mes: "May", facturacion: 165000, gastos: 110000 },
    { mes: "Jun", facturacion: 140000, gastos: 115000 },
    { mes: "Jul", facturacion: 180000, gastos: 120000 },
    { mes: "Ago", facturacion: 195000, gastos: 130000 },
    { mes: "Sep", facturacion: 175000, gastos: 125000 },
    { mes: "Oct", facturacion: 210000, gastos: 140000 },
    { mes: "Nov", facturacion: 230000, gastos: 150000 },
    { mes: "Dic", facturacion: 250000, gastos: 160000 },
]

// Formatear montos a moneda
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--color-foreground)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}>
            <p className="font-semibold mb-2">{label}</p>
            {payload.map((p: { name: string; value: number; color: string }, i: number) => (
                <div key={i} className="flex items-center justify-between gap-4 mb-1">
                    <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
                    <span className="font-semibold">{formatCurrency(p.value)}</span>
                </div>
            ))}
        </div>
    )
}

export function ActivityChart() {
    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Facturación vs Gastos</CardTitle>
                <CardDescription>Resumen financiero mensual del año en curso</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[280px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 16 }}>
                            <defs>
                                <linearGradient id="gradFact" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradGas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                            <XAxis
                                dataKey="mes"
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                stroke="var(--color-muted-foreground)"
                                dy={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                stroke="var(--color-muted-foreground)"
                                tickFormatter={(val) => `$${val / 1000}k`}
                                width={48}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="facturacion"
                                name="Facturación"
                                stroke="var(--color-chart-1)"
                                strokeWidth={2}
                                fill="url(#gradFact)"
                            />
                            <Area
                                type="monotone"
                                dataKey="gastos"
                                name="Gastos"
                                stroke="var(--color-chart-2)"
                                strokeWidth={2}
                                fill="url(#gradGas)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-center gap-6 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-chart-1" />
                        <span className="text-sm text-foreground font-medium">Facturación</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-chart-2" />
                        <span className="text-sm text-foreground font-medium">Gastos</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
