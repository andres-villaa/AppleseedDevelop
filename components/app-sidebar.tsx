"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  Bell,
  LogOut,
  ChevronDown,
  User,
  HandCoins,
  Receipt,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/supabase/actions"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const mainNav = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Donantes",
    href: "/registros",
    icon: Users,
  },
  {
    title: "Donaciones",
    href: "/donaciones",
    icon: HandCoins,
  },
  {
    title: "Gastos",
    href: "/gastos",
    icon: Receipt,
  },
  {
    title: "Documentos",
    href: "/documentos",
    icon: FileText,
  },
]

const secondaryNav = [
  {
    title: "Notificaciones",
    href: "/notificaciones",
    icon: Bell,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [userName, setUserName] = useState("Cargando...")
  const [userEmail, setUserEmail] = useState("cargando@org.com")
  const [userInitials, setUserInitials] = useState("...")
  const [alertasPendientes, setAlertasPendientes] = useState(0)

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          setUserEmail(user.email || "Usuario")

          const { data, error } = await supabase
            .from('Organizaciones')
            .select('nombre')
            .eq('org_id', user.id)
            .single()

          if (!error && data) {
            setUserName(data.nombre || "Organización")

            // Generate initials assuming it's the org name
            if (data.nombre) {
              const words = data.nombre.split(' ')
              setUserInitials(
                (words.length > 1 ? words[0][0] + words[1][0] : words[0].substring(0, 2)).toUpperCase()
              )
            }
          }

          // Contar alertas no atendidas
          const { count } = await supabase
            .from('Alertas_Cumplimiento')
            .select('*', { count: 'exact', head: true })
            .eq('organizacion_id', user.id)
            .eq('atendida', false)
          setAlertasPendientes(count ?? 0)
        }
      } catch (error) {
        setUserName("Usuario de Appleseed")
        setUserInitials("UA")
      }
    }
    loadUser()
  }, [])

  async function handleSignOut() {
    try {
      await signOut()
      router.push("/login")
      toast.success("Sesión cerrada")
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
              Appleseed
            </span>
            <span className="text-[11px] text-sidebar-foreground/60">
              Prevención de Lavado de Activos
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(mainNav as { title: string; href: string; icon: React.ElementType; badge?: string }[]).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="bg-sidebar-primary text-sidebar-primary-foreground rounded-full text-[10px] px-1.5">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {alertasPendientes > 0 && (
                    <SidebarMenuBadge className="bg-sidebar-primary text-sidebar-primary-foreground rounded-full text-[10px] px-1.5">
                      {alertasPendientes}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              <Avatar className="size-8">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-xs font-medium truncate">{userName}</span>
                <span className="text-[11px] text-sidebar-foreground/60 truncate">
                  {userEmail}
                </span>
              </div>
              <ChevronDown className="size-4 text-sidebar-foreground/40" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/perfil">
                <User className="mr-2 size-4" />
                Mi Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Cerrar Sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
