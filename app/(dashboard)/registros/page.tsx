import { getDonantes } from "@/lib/supabase/queries"
import { RegistrosClient } from "@/components/dashboard/registros-client"

export default async function RegistrosPage() {
  const donantes = await getDonantes()

  return <RegistrosClient donantes={donantes} />
}
