"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Plus,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react"
import type { Donante } from "@/lib/types"

const donantes: Donante[] = [
  {
    donante_id: "don-001",
    org_id: "org-001",
    tipo_persona: "moral",
    nombre_razon_social: "Inversiones del Norte S.A.",
    rfc: "INO850101AAA",
    regimen_fiscal: "601 - General de Ley Personas Morales",
    codigo_postal: "64000",
    direccion: "Av. Constitución 100, Monterrey, NL",
    email: "contacto@inversionesdelnorte.mx",
    actividad_economica: "Servicios financieros",
    es_pep: false,
    estatus_expediente: "completo",
    donacion_acumulada: 250000,
    created_at: "2025-12-15",
  },
  {
    donante_id: "don-002",
    org_id: "org-001",
    tipo_persona: "fisica",
    nombre_razon_social: "Carlos Mendez Rodriguez",
    rfc: "MERC890523BB1",
    curp: "MERC890523HNLNRL09",
    regimen_fiscal: "605 - Sueldos y Salarios",
    codigo_postal: "06600",
    direccion: "Calle Reforma 45, CDMX",
    email: "carlos.mendez@email.com",
    actividad_economica: "Empleado sector privado",
    es_pep: false,
    estatus_expediente: "completo",
    donacion_acumulada: 48500,
    created_at: "2025-12-18",
  },
  {
    donante_id: "don-003",
    org_id: "org-001",
    tipo_persona: "moral",
    nombre_razon_social: "Global Trading S.A. de C.V.",
    rfc: "GTS910301CC2",
    regimen_fiscal: "601 - General de Ley Personas Morales",
    codigo_postal: "11000",
    direccion: "Paseo de la Reforma 250, CDMX",
    email: "finanzas@globaltrading.mx",
    actividad_economica: "Comercio internacional",
    es_pep: false,
    estatus_expediente: "en_revision",
    donacion_acumulada: 980000,
    created_at: "2026-01-05",
  },
  {
    donante_id: "don-004",
    org_id: "org-001",
    tipo_persona: "fisica",
    nombre_razon_social: "Maria Fernanda Lopez",
    rfc: "LOFM920715DD3",
    curp: "LOFM920715MOCRPR05",
    regimen_fiscal: "612 - Personas Fisicas con Actividades Empresariales",
    codigo_postal: "68000",
    direccion: "Calle Macedonio Alcalá 30, Oaxaca",
    email: "mflopez@gmail.com",
    actividad_economica: "Comercio al por menor",
    es_pep: false,
    estatus_expediente: "completo",
    donacion_acumulada: 15200,
    created_at: "2026-01-10",
  },
  {
    donante_id: "don-005",
    org_id: "org-001",
    tipo_persona: "moral",
    nombre_razon_social: "Tech Solutions Mexico",
    rfc: "TSM880920EE4",
    regimen_fiscal: "601 - General de Ley Personas Morales",
    codigo_postal: "44100",
    direccion: "Av. López Mateos 1500, Guadalajara, JAL",
    email: "donaciones@techsolutions.mx",
    actividad_economica: "Tecnología y software",
    es_pep: false,
    estatus_expediente: "completo",
    donacion_acumulada: 120000,
    created_at: "2026-01-22",
  },
  {
    donante_id: "don-006",
    org_id: "org-001",
    tipo_persona: "fisica",
    nombre_razon_social: "Roberto Sanchez Diaz",
    rfc: "SADR770412FF5",
    curp: "SADR770412HDFNCB02",
    regimen_fiscal: "605 - Sueldos y Salarios",
    codigo_postal: "83000",
    direccion: "Blvd. Rodolfo Elías Calles 120, Hermosillo, SON",
    email: "roberto.sanchez@email.com",
    actividad_economica: "Servidor público",
    es_pep: true,
    estatus_expediente: "en_revision",
    donacion_acumulada: 75000,
    created_at: "2026-02-01",
  },
  {
    donante_id: "don-007",
    org_id: "org-001",
    tipo_persona: "moral",
    nombre_razon_social: "Exportadora Pacific S.A.",
    rfc: "EPA960101GG6",
    regimen_fiscal: "601 - General de Ley Personas Morales",
    codigo_postal: "22000",
    direccion: "Blvd. Agua Caliente 4500, Tijuana, BC",
    email: "admin@exportadorapacific.mx",
    actividad_economica: "Exportación de mercancías",
    es_pep: false,
    estatus_expediente: "completo",
    donacion_acumulada: 430000,
    created_at: "2026-02-08",
  },
  {
    donante_id: "don-008",
    org_id: "org-001",
    tipo_persona: "fisica",
    nombre_razon_social: "Ana Gutierrez Vega",
    rfc: "GUVA850330HH7",
    curp: "GUVA850330MOCRNG09",
    regimen_fiscal: "612 - Personas Fisicas con Actividades Empresariales",
    codigo_postal: "76000",
    direccion: "Calle Corregidora 88, Querétaro, QRO",
    email: "ana.gutierrez@gmail.com",
    actividad_economica: "Consultoría independiente",
    es_pep: false,
    estatus_expediente: "incompleto",
    donacion_acumulada: 22800,
    created_at: "2026-02-12",
  },
]

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount)
}

function getEstatusbadge(estatus: Donante["estatus_expediente"]) {
  switch (estatus) {
    case "completo":
      return <Badge variant="outline" className="border-success text-success text-[10px]">Completo</Badge>
    case "en_revision":
      return <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">En Revisión</Badge>
    case "incompleto":
      return <Badge variant="destructive" className="bg-destructive text-white text-[10px]">Incompleto</Badge>
  }
}

export default function RegistrosPage() {
  const [search, setSearch] = useState("")
  const [filterEstatus, setFilterEstatus] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailDonante, setDetailDonante] = useState<Donante | null>(null)

  const filtered = donantes.filter((d) => {
    const matchSearch =
      d.nombre_razon_social.toLowerCase().includes(search.toLowerCase()) ||
      d.rfc.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
    const matchEstatus = filterEstatus === "all" || d.estatus_expediente === filterEstatus
    const matchTipo = filterTipo === "all" || d.tipo_persona === filterTipo
    return matchSearch && matchEstatus && matchTipo
  })

  return (
    <>
      <DashboardHeader
        title="Donantes"
        description="Gestión del expediente KYC de donantes registrados"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Expedientes Completos</p>
              <p className="text-2xl font-bold mt-1">{donantes.filter(d => d.estatus_expediente === "completo").length}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">En Revisión</p>
              <p className="text-2xl font-bold mt-1">{donantes.filter(d => d.estatus_expediente === "en_revision").length}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Expedientes Incompletos</p>
              <p className="text-2xl font-bold mt-1">{donantes.filter(d => d.estatus_expediente === "incompleto").length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, RFC o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterEstatus} onValueChange={setFilterEstatus}>
              <SelectTrigger className="w-[160px] h-9">
                <Filter className="mr-2 size-3.5" />
                <SelectValue placeholder="Expediente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="incompleto">Incompleto</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[160px] h-9">
                <Filter className="mr-2 size-3.5" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="fisica">Persona Física</SelectItem>
                <SelectItem value="moral">Persona Moral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9">
                <Plus className="mr-2 size-4" />
                Nuevo Donante
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Donante</DialogTitle>
                <DialogDescription>
                  Ingresa los datos del donante para iniciar su expediente KYC.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="nombre">Nombre Completo / Razón Social</Label>
                    <Input id="nombre" placeholder="Ej. Inversiones del Norte S.A." />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tipo">Tipo de Persona</Label>
                    <Select>
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fisica">Persona Física</SelectItem>
                        <SelectItem value="moral">Persona Moral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="rfc">RFC</Label>
                    <Input id="rfc" placeholder="Ej. INO850101AAA" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="curp">CURP (solo persona física)</Label>
                    <Input id="curp" placeholder="Ej. MERC890523HNLNRL09" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="regimen">Régimen Fiscal</Label>
                    <Select>
                      <SelectTrigger id="regimen">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="601">601 - General de Ley Personas Morales</SelectItem>
                        <SelectItem value="605">605 - Sueldos y Salarios</SelectItem>
                        <SelectItem value="612">612 - Personas Físicas con Actividades Empresariales</SelectItem>
                        <SelectItem value="626">626 - Régimen Simplificado de Confianza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cp">Código Postal</Label>
                    <Input id="cp" placeholder="Ej. 06600" maxLength={5} />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input id="direccion" placeholder="Calle, número, colonia, ciudad, estado" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="actividad">Actividad Económica</Label>
                    <Input id="actividad" placeholder="Ej. Comercio al por mayor" />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <input type="checkbox" id="pep" className="size-4" />
                  <Label htmlFor="pep" className="font-normal text-sm cursor-pointer">
                    El donante es una Persona Políticamente Expuesta (PEP)
                  </Label>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Guardar Donante</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table + Pagination */}
        <Card>
          <CardHeader className="py-3 px-5">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {filtered.length} donantes
                {filtered.length !== donantes.length && ` filtrados de ${donantes.length}`}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="size-7" disabled>
                  <ChevronLeft className="size-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-7 min-w-7 px-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="icon" className="size-7" disabled>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Donante</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">RFC</TableHead>
                  <TableHead className="hidden lg:table-cell">Actividad</TableHead>
                  <TableHead>Expediente</TableHead>
                  <TableHead className="hidden md:table-cell">Donación Acum.</TableHead>
                  <TableHead className="text-right pr-5">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((donante) => (
                  <TableRow key={donante.donante_id} className="cursor-pointer">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{donante.nombre_razon_social}</span>
                          <span className="text-[11px] text-muted-foreground">{donante.email}</span>
                        </div>
                        {donante.es_pep && (
                          <ShieldAlert className="size-4 text-destructive shrink-0" aria-label="Persona Políticamente Expuesta" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {donante.tipo_persona === "fisica" ? "Persona Física" : "Persona Moral"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                      {donante.rfc}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[160px] truncate">
                      {donante.actividad_economica}
                    </TableCell>
                    <TableCell>{getEstatusbadge(donante.estatus_expediente)}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm font-medium">
                      {formatMXN(donante.donacion_acumulada)}
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setDetailDonante(donante)}
                      >
                        <Eye className="size-3.5" />
                        <span className="sr-only">Ver detalle</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>



        {/* Detail Dialog */}
        <Dialog open={!!detailDonante} onOpenChange={() => setDetailDonante(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalle del Donante</DialogTitle>
              <DialogDescription>
                Expediente KYC completo — {detailDonante?.nombre_razon_social}
              </DialogDescription>
            </DialogHeader>
            {detailDonante && (
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center gap-3">
                  {getEstatusband(detailDonante.estatus_expediente)}
                  {detailDonante.es_pep && (
                    <Badge variant="destructive" className="gap-1 text-[10px]">
                      <ShieldAlert className="size-3" /> PEP
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">{detailDonante.tipo_persona === "fisica" ? "Persona Física" : "Persona Moral"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">RFC</p>
                    <p className="text-sm font-mono">{detailDonante.rfc}</p>
                  </div>
                  {detailDonante.curp && (
                    <div>
                      <p className="text-xs text-muted-foreground">CURP</p>
                      <p className="text-sm font-mono">{detailDonante.curp}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Régimen Fiscal</p>
                    <p className="text-sm">{detailDonante.regimen_fiscal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{detailDonante.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Código Postal</p>
                    <p className="text-sm">{detailDonante.codigo_postal}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Dirección</p>
                    <p className="text-sm">{detailDonante.direccion}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Actividad Económica</p>
                    <p className="text-sm">{detailDonante.actividad_economica}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Donación Acumulada Total</p>
                    <p className="text-xl font-bold text-foreground">{formatMXN(detailDonante.donacion_acumulada)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Fecha de Registro</p>
                    <p className="text-sm">{detailDonante.created_at}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}

// Helper used in dialog - separate to avoid duplicate
function getEstatusband(estatus: Donante["estatus_expediente"]) {
  switch (estatus) {
    case "completo":
      return <Badge variant="outline" className="border-success text-success text-[10px]">Expediente Completo</Badge>
    case "en_revision":
      return <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">En Revisión</Badge>
    case "incompleto":
      return <Badge variant="destructive" className="bg-destructive text-white text-[10px]">Expediente Incompleto</Badge>
  }
}
