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
    FileX,
    Download,
    Eye,
    Filter,
    Building2,
    Users,
} from "lucide-react"
import type { DocumentoOrg, DocumentoDonante } from "@/lib/types"

type DocumentoOrgExt = DocumentoOrg & { donante_nombre?: string }
type DocumentoDonanteExt = DocumentoDonante & { nombre_donante?: string }

function isVencido(fecha: string) {
    if (!fecha) return false
    return new Date(fecha) < new Date()
}

function isProximoVencer(fecha: string) {
    if (!fecha) return false
    const diff = (new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff > 0 && diff <= 30
}

function getVencimientoBadge(fecha: string) {
    if (!fecha) return <Badge variant="secondary" className="text-[10px]">Sin Vencimiento</Badge>
    if (isVencido(fecha)) return <Badge variant="destructive" className="text-[10px]">Vencido</Badge>
    if (isProximoVencer(fecha)) return <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10 text-[10px]">Por vencer</Badge>
    return <Badge variant="outline" className="border-success text-success text-[10px]">Vigente</Badge>
}

export function DocumentosClient({
    docsOrg,
    docsDonante,
    headerActions
}: {
    docsOrg: DocumentoOrgExt[];
    docsDonante: DocumentoDonanteExt[];
    headerActions?: React.ReactNode
}) {
    const [search, setSearch] = useState("")
    const [filterTipoOrg, setFilterTipoOrg] = useState("all")
    const [filterTipoDon, setFilterTipoDon] = useState("all")
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("organizacion")

    const filteredOrg = docsOrg.filter((d) => {
        const matchSearch = (d.titulo || "").toLowerCase().includes(search.toLowerCase())
        const matchTipo = filterTipoOrg === "all" || (d.tipo_archivo || "").toLowerCase() === filterTipoOrg
        return matchSearch && matchTipo
    })

    const filteredDon = docsDonante.filter((d) => {
        const matchSearch =
            (d.tipo_documento || "").toLowerCase().includes(search.toLowerCase()) ||
            (d.nombre_donante || "").toLowerCase().includes(search.toLowerCase())
        const matchTipo = filterTipoDon === "all" || (d.tipo_documento || "").toLowerCase().includes(filterTipoDon)
        return matchSearch && matchTipo
    })

    // Count items with vencimiento
    const allDocs = [...docsOrg, ...docsDonante]
    const vencidosCount = allDocs.filter(d => d.fecha_vencimiento && (isVencido(d.fecha_vencimiento) || isProximoVencer(d.fecha_vencimiento))).length
    const vigentesCount = allDocs.filter(d => d.fecha_vencimiento && !isVencido(d.fecha_vencimiento) && !isProximoVencer(d.fecha_vencimiento)).length

    return (
        <>
            <DashboardHeader
                title="Documentos"
                description="Gestión documental de la organización y donantes"
                actions={headerActions}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Docs Organización", value: docsOrg.length.toString(), icon: Building2, color: "bg-primary/10 text-primary" },
                        { label: "Docs Donantes", value: docsDonante.length.toString(), icon: Users, color: "bg-primary/10 text-primary" },
                        { label: "Vigentes", value: vigentesCount.toString(), icon: FileCheck, color: "bg-success/10 text-success" },
                        { label: "Vencidos o Por Vencer", value: vencidosCount.toString(), icon: FileX, color: "bg-destructive/10 text-destructive" },
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
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-4">
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

                        <div className="ml-8">
                            {activeTab === "organizacion" ? (
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
                            ) : (
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
                                        <SelectItem value="declaración">Declaración de PEP</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Tab: Documentos Organización */}
                    <TabsContent value="organizacion" className="mt-0">
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
                    <TabsContent value="donantes" className="mt-0">
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
