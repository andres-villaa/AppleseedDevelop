import { Suspense } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDonantes } from "@/lib/supabase/queries"
import { RegistrosClient } from "@/components/dashboard/registros-client"
import { NotificationsButton } from "@/components/notifications-button"

const notifFallback = (
  <Button variant="ghost" size="icon" className="size-8" disabled>
    <Bell className="size-4" />
  </Button>
)

export default async function RegistrosPage() {
  const donantes = await getDonantes()

  return (
    <RegistrosClient
      donantes={donantes}
      headerActions={<Suspense fallback={notifFallback}><NotificationsButton /></Suspense>}
    />
  )
}
