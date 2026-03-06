import { Suspense } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationsButton } from "@/components/notifications-button"
import { getAlertas } from "@/lib/supabase/queries"
import { NotificacionesTimeline } from "@/components/dashboard/notificaciones-timeline"

const notifFallback = (
    <Button variant="ghost" size="icon" className="size-8" disabled>
        <Bell className="size-4" />
    </Button>
)

export default async function NotificacionesPage() {
    const alertas = await getAlertas()

    const totalAlertas = alertas.length
    const pendientes = alertas.filter(a => !a.atendida).length
    const atendidas = alertas.filter(a => a.atendida).length

    return (
        <>
            <DashboardHeader
                title="Notificaciones"
                description="Alertas y eventos de cumplimiento generados por el sistema"
                actions={<Suspense fallback={notifFallback}><NotificationsButton /></Suspense>}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 overflow-hidden">

                {/* Resumen */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Total de alertas</p>
                            <p className="text-2xl font-bold">{totalAlertas}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">en el historial</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-destructive">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Sin atender</p>
                            <p className="text-2xl font-bold text-destructive">{pendientes}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">requieren atención</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-success">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Atendidas</p>
                            <p className="text-2xl font-bold">{atendidas}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">resueltas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline */}
                <Card>
                    <CardHeader className="py-4 px-5">
                        <CardTitle className="text-sm font-medium">Historial de Alertas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <NotificacionesTimeline alertas={alertas} />
                    </CardContent>
                </Card>

            </div>
        </>
    )
}
