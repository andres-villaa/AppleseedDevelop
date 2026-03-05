import { Suspense } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDonaciones, getDonantes, getUMAActual } from "@/lib/supabase/queries"
import { DonacionesClient } from "@/components/dashboard/donaciones-client"
import { NotificationsButton } from "@/components/notifications-button"

const notifFallback = (
    <Button variant="ghost" size="icon" className="size-8" disabled>
        <Bell className="size-4" />
    </Button>
)

export default async function DonacionesPage() {
    const [donaciones, donantes, umaActual] = await Promise.all([
        getDonaciones(),
        getDonantes(),
        getUMAActual()
    ])

    return (
        <DonacionesClient
            donaciones={donaciones}
            donantes={donantes}
            umaActual={umaActual}
            headerActions={<Suspense fallback={notifFallback}><NotificationsButton /></Suspense>}
        />
    )
}
