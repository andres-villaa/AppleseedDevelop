"use client"

import { useEffect, useRef } from "react"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    FileText,
    UserPlus,
    AlertTriangle,
    CheckCircle,
    Upload,
    Bell,
    DollarSign,
    ShieldAlert,
} from "lucide-react"

// ─── Datos de actividad por día y hora ────────────────────────────────────────

const activityData = [
    {
        fecha: "Hoy — 25 Feb 2026",
        eventos: [
            { hora: "09:12", tipo: "alerta", title: "Donación inusual detectada", desc: "Global Trading S.A. — $630,000 (5,568 UMAs)", icon: AlertTriangle, status: "urgente" },
            { hora: "08:55", tipo: "documento", title: "Documento vencido detectado", desc: "Identificación oficial de Roberto Sanchez Diaz expirada", icon: FileText, status: "urgente" },
            { hora: "08:30", tipo: "alerta", title: "Donante clasificado como PEP", desc: "Roberto Sanchez Diaz — diligencia reforzada requerida", icon: ShieldAlert, status: "urgente" },
            { hora: "08:15", tipo: "donacion", title: "Nueva donación registrada", desc: "Ana Gutierrez Vega — $6,700 via transferencia", icon: DollarSign, status: "nuevo" },
            { hora: "07:58", tipo: "donacion", title: "Nueva donación registrada", desc: "Exportadora Pacific S.A. — $200,000 via cheque", icon: DollarSign, status: "nuevo" },
        ],
    },
    {
        fecha: "Ayer — 24 Feb 2026",
        eventos: [
            { hora: "16:40", tipo: "verificacion", title: "Expediente KYC completado", desc: "Ana Gutierrez Vega — documentos verificados", icon: CheckCircle, status: "completado" },
            { hora: "15:22", tipo: "donacion", title: "Donación reportada a SAT", desc: "Tech Solutions Mexico — $120,000 confirmado", icon: CheckCircle, status: "completado" },
            { hora: "14:08", tipo: "registro", title: "Expediente actualizado", desc: "Global Trading S.A. de C.V. — en revisión", icon: UserPlus, status: "pendiente" },
            { hora: "11:30", tipo: "alerta", title: "Reporte PLD pendiente", desc: "4 donaciones sin reportar a SHCP", icon: Bell, status: "urgente" },
            { hora: "09:45", tipo: "donacion", title: "Nueva donación registrada", desc: "Roberto Sanchez Diaz — $75,000 via transferencia", icon: DollarSign, status: "nuevo" },
            { hora: "09:00", tipo: "documento", title: "Declaración PEP subida", desc: "Roberto Sanchez Diaz — expediente actualizado", icon: Upload, status: "pendiente" },
        ],
    },
    {
        fecha: "23 Feb 2026",
        eventos: [
            { hora: "17:05", tipo: "donacion", title: "Donación reportada a PLD", desc: "Tech Solutions Mexico — $120,000 reporte enviado", icon: CheckCircle, status: "completado" },
            { hora: "15:33", tipo: "donacion", title: "Nueva donación registrada", desc: "Tech Solutions Mexico — $120,000 via transferencia", icon: DollarSign, status: "nuevo" },
            { hora: "13:20", tipo: "documento", title: "Reporte trimestral generado", desc: "Informe ALD Q4 2025 — disponible para descarga", icon: FileText, status: "completado" },
            { hora: "10:15", tipo: "donacion", title: "Nueva donación registrada", desc: "Maria Fernanda Lopez — $8,500 en efectivo", icon: DollarSign, status: "nuevo" },
        ],
    },
    {
        fecha: "22 Feb 2026",
        eventos: [
            { hora: "16:00", tipo: "verificacion", title: "KYC aprobado", desc: "Carlos Mendez Rodriguez — expediente completo", icon: CheckCircle, status: "completado" },
            { hora: "14:45", tipo: "donacion", title: "Donación reportada a SAT", desc: "Global Trading S.A. — $350,000 confirmado", icon: CheckCircle, status: "completado" },
            { hora: "12:30", tipo: "donacion", title: "Donación reportada a PLD", desc: "Global Trading S.A. — $350,000 reporte enviado", icon: CheckCircle, status: "completado" },
            { hora: "08:22", tipo: "donacion", title: "Nueva donación registrada", desc: "Carlos Mendez Rodriguez — $12,000 via transferencia", icon: DollarSign, status: "nuevo" },
        ],
    },
]

function getStatusBadge(status: string) {
    switch (status) {
        case "nuevo": return <Badge className="bg-primary text-primary-foreground text-[10px]">Nuevo</Badge>
        case "pendiente": return <Badge variant="secondary" className="text-[10px]">Pendiente</Badge>
        case "urgente": return <Badge variant="destructive" className="text-[10px]">Urgente</Badge>
        case "completado": return <Badge variant="outline" className="border-success text-success text-[10px]">Completado</Badge>
        default: return null
    }
}

function getTipoColor(tipo: string) {
    switch (tipo) {
        case "alerta": return "bg-destructive/10 text-destructive"
        case "donacion": return "bg-primary/10 text-primary"
        case "verificacion": return "bg-success/10 text-success"
        case "documento": return "bg-warning/10 text-warning-foreground"
        default: return "bg-muted text-muted-foreground"
    }
}

// Conteo de eventos por tipo para resumen
const totalHoy = activityData[0].eventos.length
const urgentesHoy = activityData[0].eventos.filter(e => e.status === "urgente").length

// Orden de renderizado: más viejo primero → hoy al final (scroll hacia abajo)
const displayData = [...activityData].reverse().map(dia => ({
    ...dia,
    eventos: [...dia.eventos].reverse(), // cronológico ascendente dentro del día
}))

export default function NotificacionesPage() {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Auto-scroll al fondo (eventos más recientes = Hoy)
        bottomRef.current?.scrollIntoView({ behavior: "instant" })
    }, [])
    return (
        <>
            <DashboardHeader
                title="Notificaciones"
                description="Historial de actividad del sistema por día y hora"
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 overflow-hidden">

                {/* Resumen rápido */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Eventos hoy</p>
                            <p className="text-2xl font-bold">{totalHoy}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">actividades registradas</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-destructive">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Urgentes hoy</p>
                            <p className="text-2xl font-bold text-destructive">{urgentesHoy}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">requieren atención</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-success">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Total (4 días)</p>
                            <p className="text-2xl font-bold">{activityData.reduce((s, d) => s + d.eventos.length, 0)}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">eventos en el historial</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline por día */}
                <Card>
                    <CardHeader className="py-4 px-5">
                        <CardTitle className="text-sm font-medium">Timeline de Actividad</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* 100dvh - header(57) - pt+pb(48) - stat-cards(80) - gap(32) - card-header(52) - extra(16) ≈ 300px */}
                        <ScrollArea className="h-[calc(100dvh-420px)] min-h-[300px]">
                            <div className="px-5 pb-6">
                                {displayData.map((dia, dIdx) => (
                                    <div key={dIdx} className="mb-8 last:mb-0">
                                        {/* Cabecera del día */}
                                        <div className="flex items-center gap-3 mb-4 sticky top-0 bg-card py-2 z-10">
                                            <div className="h-px flex-1 bg-border" />
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
                                                {dia.fecha}
                                            </span>
                                            <div className="h-px flex-1 bg-border" />
                                        </div>

                                        {/* Eventos del día */}
                                        <div className="relative">
                                            {/* Línea vertical */}
                                            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />

                                            <div className="flex flex-col gap-0">
                                                {dia.eventos.map((ev, eIdx) => {
                                                    const Icon = ev.icon
                                                    return (
                                                        <div key={eIdx} className="flex items-start gap-4 group">
                                                            {/* Hora */}
                                                            <span className="w-12 shrink-0 pt-3 text-[11px] text-muted-foreground font-mono text-right">
                                                                {ev.hora}
                                                            </span>

                                                            {/* Ícono (sobre la línea) */}
                                                            <div className={`shrink-0 mt-2 z-10 flex size-7 items-center justify-center rounded-full border-2 border-background ring-1 ring-border ${getTipoColor(ev.tipo)}`}>
                                                                <Icon className="size-3" />
                                                            </div>

                                                            {/* Contenido */}
                                                            <div className={`flex flex-1 items-start justify-between gap-2 py-2.5 px-3 rounded-lg mb-2 transition-colors group-hover:bg-muted/50 ${eIdx < dia.eventos.length - 1 ? "" : ""}`}>
                                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                                    <p className="text-sm font-medium">{ev.title}</p>
                                                                    <p className="text-xs text-muted-foreground">{ev.desc}</p>
                                                                </div>
                                                                <div className="shrink-0 mt-0.5">
                                                                    {getStatusBadge(ev.status)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {dIdx < activityData.length - 1 && <Separator className="mt-2" />}
                                    </div>
                                ))}
                                {/* Ancla al fondo para auto-scroll */}
                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

            </div>
        </>
    )
}
