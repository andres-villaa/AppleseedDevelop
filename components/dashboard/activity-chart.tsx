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

// Actividad simulada por hora del día actual (09:00 → fin del día anterior)
// Combina eventos de distinto tipo: donaciones, alertas, documentos, verificaciones
const data = [
    { hora: "07:00", donaciones: 0, alertas: 0, documentos: 0 },
    { hora: "07:30", donaciones: 0, alertas: 0, documentos: 1 },
    { hora: "08:00", donaciones: 1, alertas: 1, documentos: 0 },
    { hora: "08:30", donaciones: 0, alertas: 2, documentos: 1 },
    { hora: "09:00", donaciones: 2, alertas: 1, documentos: 0 },
    { hora: "09:30", donaciones: 1, alertas: 0, documentos: 2 },
    { hora: "10:00", donaciones: 0, alertas: 1, documentos: 1 },
    { hora: "10:30", donaciones: 3, alertas: 0, documentos: 0 },
    { hora: "11:00", donaciones: 1, alertas: 2, documentos: 1 },
    { hora: "11:30", donaciones: 0, alertas: 1, documentos: 2 },
    { hora: "12:00", donaciones: 2, alertas: 0, documentos: 1 },
    { hora: "12:30", donaciones: 1, alertas: 0, documentos: 0 },
    { hora: "13:00", donaciones: 0, alertas: 1, documentos: 3 },
    { hora: "14:00", donaciones: 2, alertas: 0, documentos: 1 },
    { hora: "15:00", donaciones: 1, alertas: 2, documentos: 0 },
    { hora: "16:00", donaciones: 0, alertas: 0, documentos: 2 },
    { hora: "17:00", donaciones: 1, alertas: 1, documentos: 1 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    const total = payload.reduce((s: number, p: { value: number }) => s + p.value, 0)
    return (
        <div style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--color-foreground)",
        }}>
            <p className="font-semibold mb-1">{label} hrs</p>
            {payload.map((p: { name: string; value: number; color: string }, i: number) => (
                p.value > 0 && (
                    <p key={i} style={{ color: p.color }}>
                        {p.name}: {p.value}
                    </p>
                )
            ))}
            <p className="text-muted-foreground mt-1 border-t pt-1">Total: {total} eventos</p>
        </div>
    )
}

export function ActivityChart() {
    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Actividad del Sistema — Hoy</CardTitle>
                <CardDescription>Eventos registrados por hora: donaciones, alertas y documentos</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                            <defs>
                                <linearGradient id="gradDon" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradAlt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradDoc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                            <XAxis
                                dataKey="hora"
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                stroke="var(--color-muted-foreground)"
                                interval={2}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                stroke="var(--color-muted-foreground)"
                                allowDecimals={false}
                                width={24}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="donaciones"
                                name="Donaciones"
                                stroke="var(--color-chart-1)"
                                strokeWidth={2}
                                fill="url(#gradDon)"
                            />
                            <Area
                                type="monotone"
                                dataKey="alertas"
                                name="Alertas"
                                stroke="var(--color-chart-4)"
                                strokeWidth={2}
                                fill="url(#gradAlt)"
                            />
                            <Area
                                type="monotone"
                                dataKey="documentos"
                                name="Documentos"
                                stroke="var(--color-chart-2)"
                                strokeWidth={2}
                                fill="url(#gradDoc)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-chart-1" />
                        <span className="text-xs text-muted-foreground">Donaciones</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-chart-4" />
                        <span className="text-xs text-muted-foreground">Alertas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-chart-2" />
                        <span className="text-xs text-muted-foreground">Documentos</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
