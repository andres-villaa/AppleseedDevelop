"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import type { Donante } from "@/lib/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, tot }: any) => {
    if (!active || !payload?.length || tot === 0) return null
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
            <p>{d.value} donantes ({((d.value / tot) * 100).toFixed(0)}%)</p>
        </div>
    )
}

export function DonorsStatusChart({ donantes }: { donantes: Donante[] }) {
    const total = donantes.length
    const no_necesario = donantes.filter(d => d.estatus_expediente === "no_necesario").length
    const pendiente_subir = donantes.filter(d => d.estatus_expediente === "pendiente_subir").length
    const documentos_subidos = donantes.filter(d => d.estatus_expediente === "documentos_subidos").length
    const fisica = donantes.filter(d => d.tipo_persona === "fisica").length
    const moral = donantes.filter(d => d.tipo_persona === "moral").length

    const expedienteData = [
        { name: "No necesario", value: no_necesario, color: "var(--color-chart-3)" },
        { name: "Pendiente de subir", value: pendiente_subir, color: "var(--color-chart-4)" },
        { name: "Documentos subidos", value: documentos_subidos, color: "var(--color-chart-2)" },
    ]

    const tipoData = [
        { name: "Persona Moral", value: moral, color: "var(--color-chart-1)" },
        { name: "Persona Física", value: fisica, color: "var(--color-chart-5)" },
    ]

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Perfil de Donantes</CardTitle>
                <CardDescription>Expedientes y tipo de persona</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                    {/* Expediente donut */}
                    <div>
                        <p className="text-[11px] font-medium text-center text-muted-foreground mb-1 uppercase tracking-wide">Expediente</p>
                        <div className="relative h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expedienteData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={65}
                                        paddingAngle={3}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {expedienteData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip tot={total} />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold">{documentos_subidos}</span>
                                <span className="text-[10px] text-muted-foreground">subidos</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-2">
                            {expedienteData.map(d => (
                                <div key={d.name} className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-muted-foreground">{d.name}</span>
                                    </div>
                                    <span className="font-medium">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tipo persona donut */}
                    <div>
                        <p className="text-[11px] font-medium text-center text-muted-foreground mb-1 uppercase tracking-wide">Tipo Persona</p>
                        <div className="relative h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={tipoData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={65}
                                        paddingAngle={3}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {tipoData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip tot={total} />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold">{total}</span>
                                <span className="text-[10px] text-muted-foreground">total</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-2">
                            {tipoData.map(d => (
                                <div key={d.name} className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-muted-foreground">{d.name}</span>
                                    </div>
                                    <span className="font-medium">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
