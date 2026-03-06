"use client"

import { useState, useTransition } from "react"
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
    User,
    Loader2,
    Edit,
} from "lucide-react"
import type { Donante } from "@/lib/types"
import { addDonante, marcarDocumentosSubidos, updateDonante } from "@/lib/supabase/actions"
import { toast } from "sonner"

function formatMXN(amount: number) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
    }).format(amount)
}

function getEstatusbadge(estatus: Donante["estatus_expediente"]) {
    switch (estatus) {
        case "no_necesario":
            return <Badge variant="secondary" className="text-[10px]">No necesario</Badge>
        case "pendiente_subir":
            return <Badge variant="destructive" className="text-[10px]">Pendiente de subir</Badge>
        case "documentos_subidos":
            return <Badge variant="outline" className="border-success text-success text-[10px]">Documentos subidos</Badge>
        default:
            return <Badge variant="secondary" className="text-[10px]">{estatus}</Badge>
    }
}

// Helper used in dialog
function getEstatusband(estatus: Donante["estatus_expediente"]) {
    switch (estatus) {
        case "no_necesario":
            return <Badge variant="secondary" className="text-[10px]">Expediente: No necesario</Badge>
        case "pendiente_subir":
            return <Badge variant="destructive" className="text-[10px]">Pendiente de subir documentos</Badge>
        case "documentos_subidos":
            return <Badge variant="outline" className="border-success text-success text-[10px]">Documentos subidos</Badge>
        default:
            return <Badge variant="secondary" className="text-[10px]">{estatus}</Badge>
    }
}

export function RegistrosClient({ donantes, headerActions }: { donantes: Donante[], headerActions?: React.ReactNode }) {
    const [search, setSearch] = useState("")
    const [filterEstatus, setFilterEstatus] = useState<string>("all")
    const [filterTipo, setFilterTipo] = useState<string>("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [detailDonante, setDetailDonante] = useState<Donante | null>(null)
    const [page, setPage] = useState(1)
    const [isPending, startTransition] = useTransition()

    // Form state
    const [formData, setFormData] = useState({
        nombre: "",
        tipo_persona: "",
        rfc: "",
        curp: "",
        email: "",
        regimen_fiscal: "",
        codigo_postal: "",
        direccion: "",
        actividad_economica: "",
        es_pep: false,
    })

    const handleInputChange = (id: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const openEdit = (donante: Donante) => {
        setFormData({
            nombre: donante.nombre_razon_social,
            tipo_persona: donante.tipo_persona,
            rfc: donante.rfc,
            curp: donante.curp || "",
            email: donante.email,
            regimen_fiscal: donante.regimen_fiscal,
            codigo_postal: donante.codigo_postal,
            direccion: donante.direccion,
            actividad_economica: donante.actividad_economica,
            es_pep: donante.es_pep,
        })
        setDetailDonante(donante)
        setIsEditOpen(true)
    }

    const handleStatusUpdate = async (donanteId: string) => {
        startTransition(async () => {
            const result = await marcarDocumentosSubidos(donanteId)
            if (result.error) {
                toast.error(`Error al actualizar estatus: ${result.error}`)
            } else {
                toast.success("Estatus actualizado: Documentos subidos")
                setDetailDonante(prev => prev ? { ...prev, estatus_expediente: "documentos_subidos" } : null)
            }
        })
    }

    const handleEditSubmit = async () => {
        if (!detailDonante) return
        if (!formData.nombre || !formData.tipo_persona || !formData.rfc || !formData.email || !formData.regimen_fiscal || !formData.codigo_postal) {
            toast.error("Por favor completa los campos obligatorios")
            return
        }

        startTransition(async () => {
            const form = new FormData()
            form.append("donante_id", detailDonante.donante_id)
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value.toString())
            })

            const result = await updateDonante(form)

            if (result.error) {
                toast.error(`Error al actualizar donante: ${result.error}`)
            } else {
                toast.success("Donante actualizado exitosamente")
                setIsEditOpen(false)
                setDetailDonante(null)
            }
        })
    }

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.tipo_persona || !formData.rfc || !formData.email || !formData.regimen_fiscal || !formData.codigo_postal) {
            toast.error("Por favor completa los campos obligatorios")
            return
        }

        startTransition(async () => {
            const form = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value.toString())
            })

            const result = await addDonante(form)

            if (result.error) {
                toast.error(`Error: ${result.error}`)
            } else {
                toast.success("Donante registrado exitosamente")
                setIsDialogOpen(false)
                setFormData({
                    nombre: "",
                    tipo_persona: "",
                    rfc: "",
                    curp: "",
                    email: "",
                    regimen_fiscal: "",
                    codigo_postal: "",
                    direccion: "",
                    actividad_economica: "",
                    es_pep: false,
                })
            }
        })
    }

    const ITEMS_PER_PAGE = 7

    const filtered = donantes.filter((d) => {
        const matchSearch =
            (d.nombre_razon_social || "").toLowerCase().includes(search.toLowerCase()) ||
            (d.rfc || "").toLowerCase().includes(search.toLowerCase()) ||
            (d.email || "").toLowerCase().includes(search.toLowerCase())
        const matchEstatus = filterEstatus === "all" || d.estatus_expediente === filterEstatus
        const matchTipo = filterTipo === "all" || d.tipo_persona === filterTipo
        return matchSearch && matchEstatus && matchTipo
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <>
            <DashboardHeader
                title="Donantes"
                description="Gestión del expediente KYC de donantes registrados"
                actions={headerActions}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

                {/* Summary cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-l-4 border-l-muted">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">No necesario</p>
                            <p className="text-2xl font-bold mt-1">{donantes.filter(d => d.estatus_expediente === "no_necesario").length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-destructive">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">Pendientes de subir</p>
                            <p className="text-2xl font-bold mt-1">{donantes.filter(d => d.estatus_expediente === "pendiente_subir").length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-success">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">Documentos subidos</p>
                            <p className="text-2xl font-bold mt-1">{donantes.filter(d => d.estatus_expediente === "documentos_subidos").length}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-3 flex-wrap">
                        <div className="flex flex-col gap-1 flex-1 max-w-sm">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-0.5">Buscar</span>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre, RFC o email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-0.5">Expediente</span>
                            <Select value={filterEstatus} onValueChange={setFilterEstatus}>
                                <SelectTrigger className="w-[180px] h-9">
                                    <Filter className="mr-2 size-3.5" />
                                    <SelectValue placeholder="Expediente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="no_necesario">No necesario</SelectItem>
                                    <SelectItem value="pendiente_subir">Pendiente de subir</SelectItem>
                                    <SelectItem value="documentos_subidos">Documentos subidos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-0.5">Tipo</span>
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
                                        <Label htmlFor="nombre">Nombre Completo / Razón Social *</Label>
                                        <Input
                                            id="nombre"
                                            placeholder="Ej. Inversiones del Norte S.A."
                                            value={formData.nombre}
                                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="tipo_persona">Tipo de Persona *</Label>
                                        <Select
                                            value={formData.tipo_persona}
                                            onValueChange={(value) => handleInputChange("tipo_persona", value)}
                                        >
                                            <SelectTrigger id="tipo_persona">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fisica">Persona Física</SelectItem>
                                                <SelectItem value="moral">Persona Moral</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="rfc">RFC *</Label>
                                        <Input
                                            id="rfc"
                                            placeholder="Ej. INO850101AAA"
                                            value={formData.rfc}
                                            onChange={(e) => handleInputChange("rfc", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="curp">CURP (solo persona física)</Label>
                                        <Input
                                            id="curp"
                                            placeholder="Ej. MERC890523HNLNRL09"
                                            value={formData.curp}
                                            onChange={(e) => handleInputChange("curp", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">Correo Electrónico *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="regimen_fiscal">Régimen Fiscal *</Label>
                                        <Select
                                            value={formData.regimen_fiscal}
                                            onValueChange={(value) => handleInputChange("regimen_fiscal", value)}
                                        >
                                            <SelectTrigger id="regimen_fiscal">
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
                                        <Label htmlFor="codigo_postal">Código Postal *</Label>
                                        <Input
                                            id="codigo_postal"
                                            placeholder="Ej. 06600"
                                            maxLength={5}
                                            value={formData.codigo_postal}
                                            onChange={(e) => handleInputChange("codigo_postal", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-2">
                                        <Label htmlFor="direccion">Dirección</Label>
                                        <Input
                                            id="direccion"
                                            placeholder="Calle, número, colonia, ciudad, estado"
                                            value={formData.direccion}
                                            onChange={(e) => handleInputChange("direccion", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-2">
                                        <Label htmlFor="actividad_economica">Actividad Económica</Label>
                                        <Input
                                            id="actividad_economica"
                                            placeholder="Ej. Comercio al por mayor"
                                            value={formData.actividad_economica}
                                            onChange={(e) => handleInputChange("actividad_economica", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-md border p-3">
                                    <input
                                        type="checkbox"
                                        id="es_pep"
                                        className="size-4"
                                        checked={formData.es_pep}
                                        onChange={(e) => handleInputChange("es_pep", e.target.checked)}
                                    />
                                    <Label htmlFor="es_pep" className="font-normal text-sm cursor-pointer">
                                        El donante es una Persona Políticamente Expuesta (PEP)
                                    </Label>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>Cancelar</Button>
                                    <Button onClick={handleSubmit} disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                                        Guardar Donante
                                    </Button>
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
                                <Button
                                    variant="outline" size="icon" className="size-7"
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    <ChevronLeft className="size-3.5" />
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <Button
                                        key={p}
                                        variant="outline" size="sm"
                                        className={`h-7 min-w-7 px-2 text-xs ${p === page
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                            : ""
                                            }`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline" size="icon" className="size-7"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                >
                                    <ChevronRight className="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto max-h-[calc(100dvh-400px)]">
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
                                {paginated.map((donante) => (
                                    <TableRow key={donante.donante_id} className="cursor-pointer">
                                        <TableCell className="pl-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                    <User className="size-4" />
                                                </div>
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
                                            {formatMXN(Number(donante.donacion_acumulada))}
                                        </TableCell>
                                        <TableCell className="text-right pr-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7"
                                                    onClick={() => setDetailDonante(donante)}
                                                >
                                                    <Eye className="size-3.5" />
                                                    <span className="sr-only">Ver detalle</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7"
                                                    onClick={() => openEdit(donante)}
                                                >
                                                    <Edit className="size-3.5" />
                                                    <span className="sr-only">Editar</span>
                                                </Button>
                                            </div>
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
                                    {detailDonante.estatus_expediente === "pendiente_subir" && (
                                        <div className="ml-auto">
                                            <Button
                                                size="sm"
                                                className="h-7 text-xs"
                                                disabled={isPending}
                                                onClick={() => handleStatusUpdate(detailDonante.donante_id)}
                                            >
                                                {isPending ? <Loader2 className="mr-1 size-3 animate-spin" /> : null}
                                                Marcar Documentos Subidos
                                            </Button>
                                        </div>
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
                                        <p className="text-xl font-bold text-foreground">{formatMXN(Number(detailDonante.donacion_acumulada))}</p>
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

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={(open) => {
                    setIsEditOpen(open)
                    if (!open) setDetailDonante(null)
                }}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Editar Donante</DialogTitle>
                            <DialogDescription>
                                Modifica los datos del donante — {detailDonante?.nombre_razon_social}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex flex-col gap-2">
                                    <Label htmlFor="edit-nombre">Nombre Completo / Razón Social *</Label>
                                    <Input
                                        id="edit-nombre"
                                        placeholder="Ej. Inversiones del Norte S.A."
                                        value={formData.nombre}
                                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="edit-tipo_persona">Tipo de Persona *</Label>
                                    <Select
                                        value={formData.tipo_persona}
                                        onValueChange={(value) => handleInputChange("tipo_persona", value)}
                                    >
                                        <SelectTrigger id="edit-tipo_persona">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fisica">Persona Física</SelectItem>
                                            <SelectItem value="moral">Persona Moral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="edit-rfc">RFC *</Label>
                                    <Input
                                        id="edit-rfc"
                                        placeholder="Ej. INO850101AAA"
                                        value={formData.rfc}
                                        onChange={(e) => handleInputChange("rfc", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="edit-curp">CURP (solo persona física)</Label>
                                    <Input
                                        id="edit-curp"
                                        placeholder="Ej. MERC890523HNLNRL09"
                                        value={formData.curp}
                                        onChange={(e) => handleInputChange("curp", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="edit-email">Correo Electrónico *</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="edit-regimen_fiscal">Régimen Fiscal *</Label>
                                    <Select
                                        value={formData.regimen_fiscal}
                                        onValueChange={(value) => handleInputChange("regimen_fiscal", value)}
                                    >
                                        <SelectTrigger id="edit-regimen_fiscal">
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
                                    <Label htmlFor="edit-codigo_postal">Código Postal *</Label>
                                    <Input
                                        id="edit-codigo_postal"
                                        placeholder="Ej. 06600"
                                        maxLength={5}
                                        value={formData.codigo_postal}
                                        onChange={(e) => handleInputChange("codigo_postal", e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 flex flex-col gap-2">
                                    <Label htmlFor="edit-direccion">Dirección</Label>
                                    <Input
                                        id="edit-direccion"
                                        placeholder="Calle, número, colonia, ciudad, estado"
                                        value={formData.direccion}
                                        onChange={(e) => handleInputChange("direccion", e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 flex flex-col gap-2">
                                    <Label htmlFor="edit-actividad_economica">Actividad Económica</Label>
                                    <Input
                                        id="edit-actividad_economica"
                                        placeholder="Ej. Comercio al por mayor"
                                        value={formData.actividad_economica}
                                        onChange={(e) => handleInputChange("actividad_economica", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-md border p-3">
                                <input
                                    type="checkbox"
                                    id="edit-es_pep"
                                    className="size-4"
                                    checked={formData.es_pep}
                                    onChange={(e) => handleInputChange("es_pep", e.target.checked)}
                                />
                                <Label htmlFor="edit-es_pep" className="font-normal text-sm cursor-pointer">
                                    El donante es una Persona Políticamente Expuesta (PEP)
                                </Label>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isPending}>Cancelar</Button>
                                <Button onClick={handleEditSubmit} disabled={isPending}>
                                    {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    Actualizar Donante
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    )
}
