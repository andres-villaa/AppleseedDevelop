import { Suspense } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGastos } from "@/lib/supabase/queries"
import { GastosClient } from "@/components/dashboard/gastos-client"
import { NotificationsButton } from "@/components/notifications-button"

const notifFallback = (
    <Button variant="ghost" size="icon" className="size-8" disabled>
        <Bell className="size-4" />
    </Button>
)

export default async function GastosPage() {
    const gastos = await getGastos()

    return (
        <GastosClient
            gastos={gastos}
            headerActions={<Suspense fallback={notifFallback}><NotificationsButton /></Suspense>}
        />
    )
}
