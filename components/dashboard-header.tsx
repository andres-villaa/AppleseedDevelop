"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium text-foreground">
              {title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {description && (
        <p className="hidden text-xs text-muted-foreground md:block">
          {description}
        </p>
      )}
      <Button variant="ghost" size="icon" className="relative size-8">
        <Bell className="size-4" />
        <Badge className="absolute -top-1 -right-1 size-4 items-center justify-center rounded-full p-0 text-[10px]">
          5
        </Badge>
        <span className="sr-only">Notificaciones</span>
      </Button>
    </header>
  )
}
