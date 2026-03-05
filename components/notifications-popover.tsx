"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, BellDot, AlertTriangle, ShieldAlert, FileText, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { markAlertaAtendida } from "@/lib/supabase/actions"
import type { AlertaCumplimiento } from "@/lib/types"

function getTipoIcon(tipo: AlertaCumplimiento["tipo_alerta"]) {
    switch (tipo) {
        case "donacion_inusual": return <AlertTriangle className="size-3.5 text-destructive" />
        case "pep": return <ShieldAlert className="size-3.5 text-destructive" />
        case "expediente_incompleto": return <FileText className="size-3.5 text-warning-foreground" />
        case "reporte_pendiente": return <Clock className="size-3.5 text-warning-foreground" />
        case "documento_vencido": return <FileText className="size-3.5 text-orange-500" />
        default: return <Bell className="size-3.5 text-muted-foreground" />
    }
}

function formatFecha(isoString: string) {
    const date = new Date(isoString)
    return date.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })
}

interface NotificationsPopoverProps {
    alertas: AlertaCumplimiento[]
    count: number
}

export function NotificationsPopover({ alertas, count }: NotificationsPopoverProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [dismissing, setDismissing] = useState<number | null>(null)

    const noAtendidas = alertas.filter((a) => !a.atendida)
    const atendidas = alertas.filter((a) => a.atendida).slice(0, 5)

    async function handleDismiss(alertaId: number) {
        setDismissing(alertaId)
        await markAlertaAtendida(alertaId)
        router.refresh()
        setDismissing(null)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative size-8">
                    {count > 0 ? <BellDot className="size-4" /> : <Bell className="size-4" />}
                    {count > 0 && (
                        <Badge className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full p-0 text-[10px]">
                            {count > 9 ? "9+" : count}
                        </Badge>
                    )}
                    <span className="sr-only">Notificaciones</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <p className="text-sm font-semibold">Notificaciones</p>
                    {count > 0 && (
                        <Badge variant="destructive" className="text-[10px] h-5">
                            {count} sin atender
                        </Badge>
                    )}
                </div>
                <ScrollArea className="max-h-80">
                    {noAtendidas.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                            <CheckCircle className="size-8 text-success opacity-60" />
                            <p className="text-sm">¡Todo al día!</p>
                            <p className="text-xs">No tienes alertas pendientes</p>
                        </div>
                    )}
                    {noAtendidas.map((alerta, i) => (
                        <div key={alerta.alerta_id}>
                            <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                                    {getTipoIcon(alerta.tipo_alerta)}
                                </div>
                                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                                    <p className="text-xs font-medium leading-snug">{alerta.titulo}</p>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2">{alerta.mensaje}</p>
                                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{formatFecha(alerta.created_at)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
                                    disabled={dismissing === alerta.alerta_id}
                                    onClick={() => handleDismiss(alerta.alerta_id)}
                                    title="Marcar como atendida"
                                >
                                    <CheckCircle className="size-3.5" />
                                </Button>
                            </div>
                            {i < noAtendidas.length - 1 && <Separator />}
                        </div>
                    ))}
                    {atendidas.length > 0 && noAtendidas.length > 0 && (
                        <div className="px-4 py-2">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">Atendidas</p>
                        </div>
                    )}
                    {atendidas.map((alerta, i) => (
                        <div key={alerta.alerta_id}>
                            <div className="flex items-start gap-3 px-4 py-3 opacity-50">
                                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
                                    {getTipoIcon(alerta.tipo_alerta)}
                                </div>
                                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                                    <p className="text-xs font-medium leading-snug line-through">{alerta.titulo}</p>
                                    <p className="text-[10px] text-muted-foreground/70">{formatFecha(alerta.created_at)}</p>
                                </div>
                            </div>
                            {i < atendidas.length - 1 && <Separator />}
                        </div>
                    ))}
                </ScrollArea>
                <div className="border-t px-4 py-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-muted-foreground"
                        onClick={() => { setOpen(false); router.push("/notificaciones") }}
                    >
                        Ver todo el historial
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
