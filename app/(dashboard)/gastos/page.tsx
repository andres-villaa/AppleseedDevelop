import { getGastos } from "@/lib/supabase/queries"
import { GastosClient } from "@/components/dashboard/gastos-client"

export default async function GastosPage() {
    const gastos = await getGastos()

    return <GastosClient gastos={gastos} />
}
