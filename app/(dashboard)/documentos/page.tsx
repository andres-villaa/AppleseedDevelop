"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Upload,
  FileText,
  FileCheck,
  FileClock,
  FileX,
  Download,
  Eye,
  Filter,
  Building2,
  Users,
} from "lucide-react"
import type { DocumentoOrg, DocumentoDonante } from "@/lib/types"

// ---- Documentos de la Organización ----
const docsOrg: (DocumentoOrg & { donante_nombre?: string })[] = [
  { docs_id: 1, org_id: "org-001", titulo: "Acta Constitutiva", tipo_archivo: "Legal", ruta_archivo: "/docs/acta.pdf", fecha_subida: "2025-12-15", fecha_vencimiento: "2030-12-15" },
  { docs_id: 2, org_id: "org-001", titulo: "Constancia de Situación Fiscal", tipo_archivo: "Fiscal", ruta_archivo: "/docs/csf.pdf", numero_operacion_sat: "OP-2025-001", fecha_subida: "2026-01-10", fecha_vencimiento: "2026-12-31" },
  { docs_id: 3, org_id: "org-001", gasto_id: 1, titulo: "Factura Proveedor - Renta Enero", tipo_archivo: "Gasto", ruta_archivo: "/docs/fac-001.pdf", uuid_fiscal: "UUID-2026-001", fecha_subida: "2026-01-31", fecha_vencimiento: "2027-01-31" },
  { docs_id: 4, org_id: "org-001", titulo: "CLUNI — Registro RFOSC", tipo_archivo: "Legal", ruta_archivo: "/docs/cluni.pdf", fecha_subida: "2020-03-01", fecha_vencimiento: "2027-03-01" },
  { docs_id: 5, org_id: "org-001", titulo: "Poder Notarial Representante", tipo_archivo: "Legal", ruta_archivo: "/docs/poder.pdf", fecha_subida: "2026-01-22", fecha_vencimiento: "2028-01-22" },
]

// ---- Documentos de Donantes ----
const docsDonante: (DocumentoDonante & { nombre_donante: string })[] = [
  { docd_id: 1, org_id: "org-001", donante_id: "don-001", tipo_documento: "Identificación Oficial", ruta_archivo: "/docs/id-001.pdf", fecha_subida: "2025-12-15", fecha_vencimiento: "2027-05-01", nombre_donante: "Inversiones del Norte S.A." },
  { docd_id: 2, org_id: "org-001", donante_id: "don-002", tipo_documento: "Comprobante de Domicilio", ruta_archivo: "/docs/dom-002.pdf", fecha_subida: "2025-12-18", fecha_vencimiento: "2026-03-18", nombre_donante: "Carlos Mendez Rodriguez" },
  { docd_id: 3, org_id: "org-001", donante_id: "don-003", donacion_id: 5, tipo_documento: "Constancia de Donación", ruta_archivo: "/docs/don-003.pdf", fecha_subida: "2026-01-05", fecha_vencimiento: "2027-01-05", nombre_donante: "Global Trading S.A." },
  { docd_id: 4, org_id: "org-001", donante_id: "don-006", tipo_documento: "Declaración de PEP", ruta_archivo: "/docs/pep-006.pdf", fecha_subida: "2026-02-01", fecha_vencimiento: "2027-02-01", nombre_donante: "Roberto Sanchez Diaz" },
  { docd_id: 5, org_id: "org-001", donante_id: "don-008", tipo_documento: "Identificación Oficial", ruta_archivo: "/docs/id-008.pdf", fecha_subida: "2026-02-12", fecha_vencimiento: "2026-04-12", nombre_donante: "Ana Gutierrez Vega" },
]

function isVencido(fecha: string) {
  return new Date(fecha) < new Date()
}

function isProximoVencer(fecha: string) {
  const diff = (new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return diff > 0 && diff <= 30
}

function getVencimientoBadge(fecha: string) {
  if (isVencido(fecha)) return <Badge variant="destructive" className="text-[10px]">Vencido</Badge>
  if (isProximoVencer(fecha)) return <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10 text-[10px]">Por vencer</Badge>
  return <Badge variant="outline" className="border-success text-success text-[10px]">Vigente</Badge>
}

export default function DocumentosPage() {
  const [search, setSearch] = useState("")
  const [filterTipoOrg, setFilterTipoOrg] = useState("all")
  const [filterTipoDon, setFilterTipoDon] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const filteredOrg = docsOrg.filter((d) => {
    const matchSearch = d.titulo.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipoOrg === "all" || d.tipo_archivo.toLowerCase() === filterTipoOrg
    return matchSearch && matchTipo
  })

  const filteredDon = docsDonante.filter((d) => {
    const matchSearch =
      d.tipo_documento.toLowerCase().includes(search.toLowerCase()) ||
      d.nombre_donante.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipoDon === "all" || d.tipo_documento.toLowerCase().includes(filterTipoDon)
    return matchSearch && matchTipo
  })

  return (
    <>
      <DashboardHeader
        title="Documentos"
        description="Gestión documental de la organización y donantes"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Docs Organización", value: docsOrg.length.toString(), icon: Building2, color: "bg-primary/10 text-primary" },
            { label: "Docs Donantes", value: docsDonante.length.toString(), icon: Users, color: "bg-primary/10 text-primary" },
            { label: "Vigentes", value: [...docsOrg, ...docsDonante].filter(d => !isVencido(d.fecha_vencimiento)).length.toString(), icon: FileCheck, color: "bg-success/10 text-success" },
            { label: "Vencidos o Por Vencer", value: [...docsOrg, ...docsDonante].filter(d => isVencido(d.fecha_vencimiento) || isProximoVencer(d.fecha_vencimiento)).length.toString(), icon: FileX, color: "bg-destructive/10 text-destructive" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9">
                <Upload className="mr-2 size-4" />
                Subir Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Subir Documento</DialogTitle>
                <DialogDescription>
                  Selecciona o arrastra un archivo para subir al sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 hover:border-muted-foreground/30 transition-colors">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Upload className="size-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Arrastra tu archivo aquí</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG, PNG (máx. 10MB)</p>
                  </div>
                  <Button variant="outline" size="sm">Seleccionar Archivo</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Tipo de Documento</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="org">Documento de Organización</SelectItem>
                        <SelectItem value="donante">Documento de Donante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Fecha de Vencimiento</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Progress value={0} className="h-1.5" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setIsUploadOpen(false)}>Subir Documento</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs por tipo */}
        <Tabs defaultValue="organizacion">
          <TabsList>
            <TabsTrigger value="organizacion" className="gap-2">
              <Building2 className="size-3.5" />
              Organización ({docsOrg.length})
            </TabsTrigger>
            <TabsTrigger value="donantes" className="gap-2">
              <Users className="size-3.5" />
              Donantes ({docsDonante.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Documentos Organización */}
          <TabsContent value="organizacion" className="mt-4">
            <div className="flex items-center gap-3 mb-3">
              <Select value={filterTipoOrg} onValueChange={setFilterTipoOrg}>
                <SelectTrigger className="w-[150px] h-9">
                  <Filter className="mr-2 size-3.5" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="fiscal">Fiscal</SelectItem>
                  <SelectItem value="gasto">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardHeader className="py-3 px-5">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {filteredOrg.length} documentos encontrados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[calc(100dvh-470px)]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5">Documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="hidden md:table-cell">Subido</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead className="hidden lg:table-cell">UUID / No. Op.</TableHead>
                      <TableHead className="text-right pr-5">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrg.map((doc) => (
                      <TableRow key={doc.docs_id}>
                        <TableCell className="pl-5">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted-foreground shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{doc.titulo}</span>
                              {doc.gasto_id && (
                                <span className="text-[11px] text-muted-foreground">Vinculado a Gasto #{doc.gasto_id}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{doc.tipo_archivo}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{doc.fecha_subida}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            {getVencimientoBadge(doc.fecha_vencimiento)}
                            <span className="text-[11px] text-muted-foreground">{doc.fecha_vencimiento}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                          {doc.uuid_fiscal || doc.numero_operacion_sat || "—"}
                        </TableCell>
                        <TableCell className="text-right pr-5">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="size-7"><Download className="size-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Documentos Donantes */}
          <TabsContent value="donantes" className="mt-4">
            <div className="flex items-center gap-3 mb-3">
              <Select value={filterTipoDon} onValueChange={setFilterTipoDon}>
                <SelectTrigger className="w-[180px] h-9">
                  <Filter className="mr-2 size-3.5" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="identificación">Identificación Oficial</SelectItem>
                  <SelectItem value="comprobante">Comprobante de Domicilio</SelectItem>
                  <SelectItem value="constancia">Constancia de Donación</SelectItem>
                  <SelectItem value="pep">Declaración PEP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardHeader className="py-3 px-5">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {filteredDon.length} documentos encontrados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[calc(100dvh-470px)]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5">Documento</TableHead>
                      <TableHead>Donante</TableHead>
                      <TableHead className="hidden md:table-cell">Subido</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead className="hidden lg:table-cell">Donación</TableHead>
                      <TableHead className="text-right pr-5">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDon.map((doc) => (
                      <TableRow key={doc.docd_id}>
                        <TableCell className="pl-5">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium">{doc.tipo_documento}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.nombre_donante}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{doc.fecha_subida}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            {getVencimientoBadge(doc.fecha_vencimiento)}
                            <span className="text-[11px] text-muted-foreground">{doc.fecha_vencimiento}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {doc.donacion_id ? `Donación #${doc.donacion_id}` : "—"}
                        </TableCell>
                        <TableCell className="text-right pr-5">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="size-7"><Download className="size-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
