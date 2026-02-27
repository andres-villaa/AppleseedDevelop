import { DashboardHeader } from "@/components/dashboard-header"
import { DonantesKPI, DonacionesKPI, GastosKPI, ConfiguracionKPI } from "@/components/dashboard/stat-cards"
import { RiskChart } from "@/components/dashboard/risk-chart"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { ExpensesBreakdownChart } from "@/components/dashboard/expenses-breakdown-chart"
import { DonorsStatusChart } from "@/components/dashboard/donors-status-chart"
import { TopDonorsChart } from "@/components/dashboard/top-donors-chart"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { getDonantes, getDonaciones, getGastos, getUMAActual } from "@/lib/supabase/queries"

export default async function DashboardPage() {
  const [donantes, donaciones, gastos, umaActual] = await Promise.all([
    getDonantes(),
    getDonaciones(),
    getGastos(),
    getUMAActual()
  ])

  return (
    <>
      <DashboardHeader
        title="Panel General"
        description="Resumen de cumplimiento y actividad ALD"
      />
      <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6">

        {/* ── SECCIÓN CONFIGURACIÓN (UMA) ──────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <ConfiguracionKPI umaActual={umaActual} />
        </section>

        {/* ── SECCIÓN DONANTES ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <DonantesKPI donantes={donantes} />
          {/* Gráficas de Donantes */}
          <div className="grid gap-4 lg:grid-cols-3">
            <TopDonorsChart donantes={donantes} />   {/* col-span-2 */}
            <DonorsStatusChart donantes={donantes} />
          </div>
        </section>

        {/* ── SECCIÓN DONACIONES ───────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <DonacionesKPI donaciones={donaciones} umaActual={umaActual} />
          {/* Gráficas de Donaciones */}
          <div className="grid gap-4 lg:grid-cols-3">
            <RiskChart donaciones={donaciones} />        {/* col-span-2 */}
            <ComplianceChart donaciones={donaciones} />
          </div>
        </section>

        {/* ── SECCIÓN GASTOS + ACTIVIDAD ───────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <GastosKPI gastos={gastos} />
          {/* Gráficas de Gastos y Actividad del sistema */}
          <div className="grid gap-4 lg:grid-cols-3">
            <ActivityChart />    {/* col-span-2 -> We'll leave it as is if it doesn't need DB data, or update later */}
            <ExpensesBreakdownChart gastos={gastos} />
          </div>
        </section>

      </div>
    </>
  )
}
