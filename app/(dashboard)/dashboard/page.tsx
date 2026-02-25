import { DashboardHeader } from "@/components/dashboard-header"
import { StatCards } from "@/components/dashboard/stat-cards"
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
      <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        {/* Métricas KPI */}
        <StatCards />

        {/* Fila 1: Donantes vs PLD (grande) + Donaciones por mes */}
        <div className="grid gap-6 lg:grid-cols-3">
          <RiskChart />
          <ComplianceChart />
        </div>

        {/* Fila 2: Top Donantes (grande) + Perfil Donantes + Gastos por Categoría */}
        <div className="grid gap-6 lg:grid-cols-3">
          <TopDonorsChart />
          <DonorsStatusChart />
        </div>

        {/* Fila 3: Actividad de hoy (gráfica área) + Gastos por categoría */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ActivityChart />
          <ExpensesBreakdownChart />
        </div>
      </div>
    </>
  )
}
