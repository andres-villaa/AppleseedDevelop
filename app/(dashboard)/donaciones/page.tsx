import { getDonaciones, getDonantes, getUMAActual } from "@/lib/supabase/queries"
import { DonacionesClient } from "@/components/dashboard/donaciones-client"

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
        />
    )
}
