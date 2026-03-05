import { getAlertas } from "@/lib/supabase/queries"
import { NotificationsPopover } from "./notifications-popover"

export async function NotificationsButton() {
    const alertas = await getAlertas()
    const noAtendidas = alertas.filter((a) => !a.atendida)
    return <NotificationsPopover alertas={alertas} count={noAtendidas.length} />
}
