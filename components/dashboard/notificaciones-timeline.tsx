"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Bell, AlertTriangle, FileWarning, ShieldAlert, FileText, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { markAlertaAtendida } from "@/lib/supabase/actions"
import type { AlertaCumplimiento } from "@/lib/types"

function getAlertaIcon(tipo: AlertaCumplimiento["tipo_alerta"]) {
    switch (tipo) {
        case "reporte_pendiente": return AlertTriangle
        case "umbral_identificacion": return FileWarning
        case "pep": return ShieldAlert
        case "expediente_incompleto": return FileText
        case "documento_vencido": return FileText
        case "donacion_inusual": return AlertTriangle
        default: return Bell
    }
}

function getAlertaColor(tipo: AlertaCumplimiento["tipo_alerta"]) {
    switch (tipo) {
        case "reporte_pendiente": return "bg-destructive/10 text-destructive"
        case "umbral_identificacion": return "bg-warning/10 text-warning-foreground"
        case "pep": return "bg-destructive/10 text-destructive"
        case "donacion_inusual": return "bg-destructive/10 text-destructive"
        default: return "bg-muted text-muted-foreground"
    }
}

function groupByDate(alertas: AlertaCumplimiento[]) {
    const map = new Map<string, AlertaCumplimiento[]>()
    for (const a of alertas) {
        const day = a.created_at.slice(0, 10)
        if (!map.has(day)) map.set(day, [])
        map.get(day)!.push(a)
    }
    return map
}

function formatDayLabel(dateStr: string) {
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (dateStr === today) return "Hoy"
    if (dateStr === yesterday) return "Ayer"
    return new Date(dateStr + "T12:00:00").toLocaleDateString("es-MX", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    })
}

export function NotificacionesTimeline({ alertas }: { alertas: AlertaCumplimiento[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function handleAtender(id: number) {
        startTransition(async () => {
            await markAlertaAtendida(id)
            router.refresh()
        })
    }

    const sorted = [...alertas].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    const grouped = groupByDate(sorted)
    const days = [...grouped.keys()].sort((a, b) => b.localeCompare(a))

    if (alertas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                <Bell className="size-8 opacity-30" />
                <p className="text-sm">Sin alertas registradas</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[calc(100dvh-420px)] min-h-[300px]">
            <div className="px-5 pb-6">
                {days.map((day, dIdx) => {
                    const eventos = grouped.get(day)!
                    return (
                        <div key={day} className="mb-8 last:mb-0">
                            {/* Cabecera del día */}
                            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-card py-2 z-10">
                                <div className="h-px flex-1 bg-border" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
                                    {formatDayLabel(day)}
                                </span>
                                <div className="h-px flex-1 bg-border" />
                            </div>

                            {/* Eventos */}
                            <div className="relative">
                                <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />
                                <div className="flex flex-col gap-0">
                                    {eventos.map((alerta) => {
                                        const Icon = getAlertaIcon(alerta.tipo_alerta)
                                        const hora = new Date(alerta.created_at).toLocaleTimeString("es-MX", {
                                            hour: "2-digit", minute: "2-digit",
                                        })
                                        return (
                                            <div key={alerta.alerta_id} className="flex items-start gap-4 group">
                                                {/* Hora */}
                                                <span className="w-12 shrink-0 pt-3 text-[11px] text-muted-foreground font-mono text-right">
                                                    {hora}
                                                </span>

                                                {/* Ícono */}
                                                <div className={`shrink-0 mt-2 z-10 flex size-7 items-center justify-center rounded-full border-2 border-background ring-1 ring-border ${getAlertaColor(alerta.tipo_alerta)}`}>
                                                    <Icon className="size-3" />
                                                </div>

                                                {/* Contenido */}
                                                <div className={`flex flex-1 items-start justify-between gap-2 py-2.5 px-3 rounded-lg mb-2 transition-colors group-hover:bg-muted/50 ${alerta.atendida ? "opacity-50" : ""}`}>
                                                    <div className="flex flex-col gap-0.5 min-w-0">
                                                        <p className={`text-sm font-medium ${alerta.atendida ? "line-through" : ""}`}>{alerta.titulo}</p>
                                                        {!alerta.atendida && (
                                                            <p className="text-xs text-muted-foreground">{alerta.mensaje}</p>
                                                        )}
                                                    </div>
                                                    <div className="shrink-0 mt-0.5 flex items-center gap-1.5">
                                                        {alerta.atendida ? (
                                                            <Badge variant="outline" className="border-success text-success text-[10px]">Atendida</Badge>
                                                        ) : (
                                                            <>
                                                                <Badge variant="destructive" className="text-[10px]">Pendiente</Badge>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="size-6 text-muted-foreground hover:text-success"
                                                                    title="Marcar como atendida"
                                                                    disabled={isPending}
                                                                    onClick={() => handleAtender(alerta.alerta_id)}
                                                                >
                                                                    <CheckCircle className="size-3.5" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {dIdx < days.length - 1 && <Separator className="mt-2" />}
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
