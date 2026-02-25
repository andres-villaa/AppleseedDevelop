import { DashboardHeader } from "@/components/dashboard-header"
import { DonantesKPI, DonacionesKPI, GastosKPI } from "@/components/dashboard/stat-cards"
import { RiskChart } from "@/components/dashboard/risk-chart"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { ExpensesBreakdownChart } from "@/components/dashboard/expenses-breakdown-chart"
import { DonorsStatusChart } from "@/components/dashboard/donors-status-chart"
import { TopDonorsChart } from "@/components/dashboard/top-donors-chart"
import { ActivityChart } from "@/components/dashboard/activity-chart"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Panel General"
        description="Resumen de cumplimiento y actividad ALD"
      />
      <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6">

        {/* ── SECCIÓN DONANTES ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <DonantesKPI />
          {/* Gráficas de Donantes */}
          <div className="grid gap-4 lg:grid-cols-3">
            <TopDonorsChart />   {/* col-span-2 */}
            <DonorsStatusChart />
          </div>
        </section>

        {/* ── SECCIÓN DONACIONES ───────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <DonacionesKPI />
          {/* Gráficas de Donaciones */}
          <div className="grid gap-4 lg:grid-cols-3">
            <RiskChart />        {/* col-span-2 */}
            <ComplianceChart />
          </div>
        </section>

        {/* ── SECCIÓN GASTOS + ACTIVIDAD ───────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <GastosKPI />
          {/* Gráficas de Gastos y Actividad del sistema */}
          <div className="grid gap-4 lg:grid-cols-3">
            <ActivityChart />    {/* col-span-2 */}
            <ExpensesBreakdownChart />
          </div>
        </section>

      </div>
    </>
  )
}
