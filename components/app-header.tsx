import { Suspense } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { NotificationsButton } from "@/components/notifications-button"

interface AppHeaderProps {
    title: string
    description?: string
}

export function AppHeader({ title, description }: AppHeaderProps) {
    return (
        <DashboardHeader
            title={title}
            description={description}
            actions={
                <Suspense fallback={
                    <Button variant="ghost" size="icon" className="size-8" disabled>
                        <Bell className="size-4" />
                    </Button>
                }>
                    <NotificationsButton />
                </Suspense>
            }
        />
    )
}
