import { DashboardHeader } from "@/components/dashboard-header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { RiskChart } from "@/components/dashboard/risk-chart"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Panel General"
        description="Resumen de cumplimiento y actividad ALD"
      />
      <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <StatCards />
        <div className="grid gap-6 lg:grid-cols-3">
          <RiskChart />
          <ComplianceChart />
        </div>
        <RecentActivity />
      </div>
    </>
  )
}
