"use client"

import { useState, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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
  Upload,
  FileText,
  FileCheck,
  FileClock,
  FileX,
  Download,
  Eye,
  Filter,
} from "lucide-react"

interface Document {
  id: string
  nombre: string
  tipo: string
  registro: string
  estado: "verificado" | "pendiente" | "rechazado" | "en_revision"
  fecha: string
  tamano: string
}

const documents: Document[] = [
  { id: "DOC-001", nombre: "Acta Constitutiva", tipo: "Legal", registro: "Inversiones del Norte S.A.", estado: "verificado", fecha: "2025-12-15", tamano: "2.4 MB" },
  { id: "DOC-002", nombre: "Identificacion Oficial", tipo: "KYC", registro: "Carlos Mendez Rodriguez", estado: "verificado", fecha: "2025-12-18", tamano: "1.1 MB" },
  { id: "DOC-003", nombre: "Comprobante de Domicilio", tipo: "KYC", registro: "Carlos Mendez Rodriguez", estado: "pendiente", fecha: "2026-01-05", tamano: "850 KB" },
  { id: "DOC-004", nombre: "Estados Financieros Q4", tipo: "Financiero", registro: "Global Trading S.A.", estado: "en_revision", fecha: "2026-01-10", tamano: "5.2 MB" },
  { id: "DOC-005", nombre: "Poder Notarial", tipo: "Legal", registro: "Tech Solutions Mexico", estado: "verificado", fecha: "2026-01-22", tamano: "3.8 MB" },
  { id: "DOC-006", nombre: "Declaracion de Impuestos", tipo: "Fiscal", registro: "Roberto Sanchez Diaz", estado: "rechazado", fecha: "2026-02-01", tamano: "1.5 MB" },
  { id: "DOC-007", nombre: "Contrato de Servicios", tipo: "Legal", registro: "Exportadora Pacific S.A.", estado: "verificado", fecha: "2026-02-08", tamano: "2.1 MB" },
  { id: "DOC-008", nombre: "Beneficiario Final", tipo: "KYC", registro: "Ana Gutierrez Vega", estado: "pendiente", fecha: "2026-02-12", tamano: "980 KB" },
]

const stats = [
  { label: "Total Documentos", value: "1,923", icon: FileText, color: "bg-primary/10 text-primary" },
  { label: "Verificados", value: "1,456", icon: FileCheck, color: "bg-success/10 text-success" },
  { label: "Pendientes", value: "342", icon: FileClock, color: "bg-warning/10 text-warning-foreground" },
  { label: "Rechazados", value: "125", icon: FileX, color: "bg-destructive/10 text-destructive" },
]

function getDocStatusBadge(estado: Document["estado"]) {
  switch (estado) {
    case "verificado":
      return <Badge variant="outline" className="border-success text-success text-[10px]">Verificado</Badge>
    case "pendiente":
      return <Badge variant="secondary" className="text-[10px]">Pendiente</Badge>
    case "en_revision":
      return <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">En Revision</Badge>
    case "rechazado":
      return <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px]">Rechazado</Badge>
  }
}

export default function DocumentosPage() {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const filtered = documents.filter((d) => {
    const matchSearch =
      d.nombre.toLowerCase().includes(search.toLowerCase()) ||
      d.registro.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === "all" || d.tipo.toLowerCase() === filterType
    return matchSearch && matchType
  })

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  return (
    <>
      <DashboardHeader
        title="Documentos"
        description="Gestion y verificacion de documentacion ALD"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {/* Doc Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-9">
                <Filter className="mr-2 size-3.5" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="kyc">KYC</SelectItem>
                <SelectItem value="financiero">Financiero</SelectItem>
                <SelectItem value="fiscal">Fiscal</SelectItem>
              </SelectContent>
            </Select>
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
                  Selecciona o arrastra un archivo para subir al sistema de verificacion.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                {/* Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Upload className="size-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Arrastra tu archivo aqui
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      o haz clic para seleccionar. PDF, DOC, JPG, PNG (max. 10MB)
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Seleccionar Archivo
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Tipo de Documento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="kyc">KYC</SelectItem>
                        <SelectItem value="financiero">Financiero</SelectItem>
                        <SelectItem value="fiscal">Fiscal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Registro Asociado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reg1">Inversiones del Norte S.A.</SelectItem>
                        <SelectItem value="reg2">Carlos Mendez Rodriguez</SelectItem>
                        <SelectItem value="reg3">Global Trading S.A.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Simulated upload progress */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">acta_constitutiva.pdf</span>
                    <span className="text-xs text-muted-foreground">67%</span>
                  </div>
                  <Progress value={67} className="h-1.5" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsUploadOpen(false)}>
                    Subir Documento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader className="py-3 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {filtered.length} documentos encontrados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 w-24">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Tamano</TableHead>
                  <TableHead className="text-right pr-5">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="pl-5 font-mono text-xs text-muted-foreground">
                      {doc.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium">{doc.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px]">{doc.tipo}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {doc.registro}
                    </TableCell>
                    <TableCell>{getDocStatusBadge(doc.estado)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {doc.tamano}
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-7">
                          <Eye className="size-3.5" />
                          <span className="sr-only">Ver documento</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7">
                          <Download className="size-3.5" />
                          <span className="sr-only">Descargar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
