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
import {
  Search,
  Plus,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

type RiskLevel = "bajo" | "medio" | "alto"

interface Record {
  id: string
  nombre: string
  tipo: "persona_fisica" | "persona_moral"
  rfc: string
  riesgo: RiskLevel
  estado: "activo" | "pendiente" | "suspendido"
  fecha: string
  documentos: number
}

const records: Record[] = [
  { id: "REG-001", nombre: "Inversiones del Norte S.A.", tipo: "persona_moral", rfc: "INO850101AAA", riesgo: "bajo", estado: "activo", fecha: "2025-12-15", documentos: 8 },
  { id: "REG-002", nombre: "Carlos Mendez Rodriguez", tipo: "persona_fisica", rfc: "MERC890523BB1", riesgo: "medio", estado: "activo", fecha: "2025-12-18", documentos: 5 },
  { id: "REG-003", nombre: "Global Trading S.A. de C.V.", tipo: "persona_moral", rfc: "GTS910301CC2", riesgo: "alto", estado: "pendiente", fecha: "2026-01-05", documentos: 3 },
  { id: "REG-004", nombre: "Maria Fernanda Lopez", tipo: "persona_fisica", rfc: "LOFM920715DD3", riesgo: "bajo", estado: "activo", fecha: "2026-01-10", documentos: 6 },
  { id: "REG-005", nombre: "Tech Solutions Mexico", tipo: "persona_moral", rfc: "TSM880920EE4", riesgo: "medio", estado: "activo", fecha: "2026-01-22", documentos: 7 },
  { id: "REG-006", nombre: "Roberto Sanchez Diaz", tipo: "persona_fisica", rfc: "SADR770412FF5", riesgo: "alto", estado: "suspendido", fecha: "2026-02-01", documentos: 2 },
  { id: "REG-007", nombre: "Exportadora Pacific S.A.", tipo: "persona_moral", rfc: "EPA960101GG6", riesgo: "bajo", estado: "activo", fecha: "2026-02-08", documentos: 9 },
  { id: "REG-008", nombre: "Ana Gutierrez Vega", tipo: "persona_fisica", rfc: "GUVA850330HH7", riesgo: "medio", estado: "pendiente", fecha: "2026-02-12", documentos: 4 },
]

function getRiskBadge(riesgo: RiskLevel) {
  switch (riesgo) {
    case "bajo":
      return <Badge variant="outline" className="border-success text-success text-[10px] font-medium">Bajo</Badge>
    case "medio":
      return <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10 text-[10px] font-medium">Medio</Badge>
    case "alto":
      return <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px] font-medium">Alto</Badge>
  }
}

function getStatusBadge(estado: string) {
  switch (estado) {
    case "activo":
      return <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">Activo</Badge>
    case "pendiente":
      return <Badge variant="secondary" className="text-[10px]">Pendiente</Badge>
    case "suspendido":
      return <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px]">Suspendido</Badge>
    default:
      return null
  }
}

export default function RegistrosPage() {
  const [search, setSearch] = useState("")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailRecord, setDetailRecord] = useState<Record | null>(null)

  const filtered = records.filter((r) => {
    const matchSearch =
      r.nombre.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.rfc.toLowerCase().includes(search.toLowerCase())
    const matchRisk = filterRisk === "all" || r.riesgo === filterRisk
    return matchSearch && matchRisk
  })

  return (
    <>
      <DashboardHeader
        title="Registros"
        description="Gestion de registros de clientes y entidades"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, ID o RFC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-[140px] h-9">
                <Filter className="mr-2 size-3.5" />
                <SelectValue placeholder="Riesgo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="bajo">Bajo</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9">
                <Plus className="mr-2 size-4" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Registro</DialogTitle>
                <DialogDescription>
                  Ingresa los datos del nuevo cliente o entidad para iniciar el proceso de verificacion.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre">Nombre Completo / Razon Social</Label>
                  <Input id="nombre" placeholder="Ej. Inversiones del Norte S.A." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select>
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="persona_fisica">Persona Fisica</SelectItem>
                        <SelectItem value="persona_moral">Persona Moral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="rfc">RFC</Label>
                    <Input id="rfc" placeholder="Ej. INO850101AAA" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="riesgo">Nivel de Riesgo Inicial</Label>
                  <Select>
                    <SelectTrigger id="riesgo">
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bajo">Bajo</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Guardar Registro
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="py-3 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {filtered.length} registros encontrados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 w-24">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">RFC</TableHead>
                  <TableHead>Riesgo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Docs</TableHead>
                  <TableHead className="text-right pr-5">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow key={record.id} className="cursor-pointer">
                    <TableCell className="pl-5 font-mono text-xs text-muted-foreground">
                      {record.id}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {record.nombre}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {record.tipo === "persona_fisica" ? "Persona Fisica" : "Persona Moral"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                      {record.rfc}
                    </TableCell>
                    <TableCell>{getRiskBadge(record.riesgo)}</TableCell>
                    <TableCell>{getStatusBadge(record.estado)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {record.documentos}
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setDetailRecord(record)}
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

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 - {filtered.length} de {records.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-8" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 min-w-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="icon" className="size-8" disabled>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!detailRecord} onOpenChange={() => setDetailRecord(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalle del Registro</DialogTitle>
              <DialogDescription>
                Informacion completa del registro {detailRecord?.id}
              </DialogDescription>
            </DialogHeader>
            {detailRecord && (
              <div className="flex flex-col gap-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Nombre</p>
                    <p className="text-sm font-medium">{detailRecord.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">RFC</p>
                    <p className="text-sm font-mono">{detailRecord.rfc}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm">{detailRecord.tipo === "persona_fisica" ? "Persona Fisica" : "Persona Moral"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Registro</p>
                    <p className="text-sm">{detailRecord.fecha}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nivel de Riesgo</p>
                    <div className="mt-1">{getRiskBadge(detailRecord.riesgo)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estado</p>
                    <div className="mt-1">{getStatusBadge(detailRecord.estado)}</div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Documentos Adjuntos</p>
                  <p className="text-sm">{detailRecord.documentos} documento(s)</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
