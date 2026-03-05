import { Suspense } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDocumentosOrg, getDocumentosDonantes } from "@/lib/supabase/queries"
import { DocumentosClient } from "@/components/dashboard/documentos-client"
import { NotificationsButton } from "@/components/notifications-button"

const notifFallback = (
  <Button variant="ghost" size="icon" className="size-8" disabled>
    <Bell className="size-4" />
  </Button>
)

export default async function DocumentosPage() {
  const [docsOrg, docsDonante] = await Promise.all([
    getDocumentosOrg(),
    getDocumentosDonantes()
  ])

  return (
    <DocumentosClient
      docsOrg={docsOrg}
      docsDonante={docsDonante}
      headerActions={<Suspense fallback={notifFallback}><NotificationsButton /></Suspense>}
    />
  )
}
