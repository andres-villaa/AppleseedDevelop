"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addGasto } from "@/lib/supabase/actions"
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
    Wallet,
    Receipt,
    Building2,
    Home,
    Users,
    Plane,
    Wrench,
    Package,
} from "lucide-react"
import type { Gasto } from "@/lib/types"

function formatMXN(amount: number) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
    }).format(amount)
}

const CATEGORIAS = [
    "Renta",
    "Nómina",
    "Servicios",
    "Materiales",
    "Viáticos",
    "Otros",
]

function getCategoriaIcon(cat: string) {
    switch (cat) {
        case "Renta": return <Home className="size-4" />
        case "Nómina": return <Users className="size-4" />
        case "Servicios": return <Wrench className="size-4" />
        case "Materiales": return <Package className="size-4" />
        case "Viáticos": return <Plane className="size-4" />
        default: return <Receipt className="size-4" />
    }
}

function getCategoriaBadgeClass(cat: string) {
    switch (cat) {
        case "Renta": return "border-primary/40 text-primary bg-primary/5"
        case "Nómina": return "border-success/40 text-success bg-success/5"
        case "Servicios": return "border-warning/40 text-warning-foreground bg-warning/5"
        case "Materiales": return "border-secondary text-secondary-foreground bg-secondary/30"
        case "Viáticos": return "border-primary/30 text-muted-foreground"
        default: return ""
    }
}

const ITEMS_PER_PAGE = 7

export function GastosClient({ gastos }: { gastos: Gasto[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState("")
    const [filterCat, setFilterCat] = useState("all")
    const [page, setPage] = useState(1)
    const [isNewOpen, setIsNewOpen] = useState(false)
    const [detail, setDetail] = useState<Gasto | null>(null)

    // Form state
    const emptyForm = { categoria: "", concepto: "", monto: "", rfc_proveedor: "", fecha: "" }
    const [form, setForm] = useState(emptyForm)

    function handleFormChange(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    function handleSaveGasto() {
        startTransition(async () => {
            const fd = new FormData()
            fd.set("categoria", form.categoria)
            fd.set("concepto", form.concepto)
            fd.set("monto", form.monto)
            fd.set("rfc_proveedor", form.rfc_proveedor)
            fd.set("fecha", form.fecha)

            const result = await addGasto(fd)

            if (result.error) {
                toast.error("Error al guardar el gasto", { description: result.error })
            } else {
                toast.success("Gasto registrado correctamente")
                setIsNewOpen(false)
                setForm(emptyForm)
                router.refresh()
            }
        })
    }


    const filtered = gastos.filter((g) => {
        const matchSearch =
            g.concepto.toLowerCase().includes(search.toLowerCase()) ||
            g.rfc_proveedor.toLowerCase().includes(search.toLowerCase()) ||
            g.categoria.toLowerCase().includes(search.toLowerCase())
        const matchCat = filterCat === "all" || g.categoria === filterCat
        return matchSearch && matchCat
    })

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const totalGastado = gastos.reduce((s, g) => s + Number(g.monto), 0)

    // Totales por categoría para el resumen
    const porCategoria = CATEGORIAS.map((cat) => ({
        cat,
        total: gastos.filter((g) => g.categoria === cat).reduce((s, g) => s + Number(g.monto), 0),
        count: gastos.filter((g) => g.categoria === cat).length,
    })).filter((c) => c.count > 0)

    return (
        <>
            <DashboardHeader
                title="Gastos"
                description="Registro de egresos de la organización con documentación fiscal"
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-primary sm:col-span-2 lg:col-span-1">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <Wallet className="size-3.5" />
                                Total Gastado
                            </div>
                            <p className="text-xl font-bold">{formatMXN(totalGastado)}</p>
                            <p className="text-[11px] text-muted-foreground mt-1">{gastos.length} registros</p>
                        </CardContent>
                    </Card>
                    {porCategoria.slice(0, 3).map(({ cat, total, count }) => (
                        <Card key={cat}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    {getCategoriaIcon(cat)}
                                    {cat}
                                </div>
                                <p className="text-xl font-bold">{formatMXN(total)}</p>
                                <p className="text-[11px] text-muted-foreground mt-1">{count} {count === 1 ? "registro" : "registros"}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar concepto, RFC o categoría..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                className="pl-9 h-9"
                            />
                        </div>
                        <Select value={filterCat} onValueChange={(v) => { setFilterCat(v); setPage(1) }}>
                            <SelectTrigger className="w-[160px] h-9">
                                <Filter className="mr-2 size-3.5" />
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                {CATEGORIAS.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-9">
                                <Plus className="mr-2 size-4" />
                                Nuevo Gasto
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
                                <DialogDescription>
                                    Ingresa los datos del egreso. Puedes vincular el documento fiscal correspondiente.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Categoría</Label>
                                        <Select value={form.categoria} onValueChange={(v) => handleFormChange("categoria", v)}>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIAS.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Monto (MXN)</Label>
                                        <Input
                                            type="number"
                                            placeholder="Ej. 18500"
                                            value={form.monto}
                                            onChange={(e) => handleFormChange("monto", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-2">
                                        <Label>Concepto / Descripción</Label>
                                        <Input
                                            placeholder="Ej. Renta de oficina — Enero 2026"
                                            value={form.concepto}
                                            onChange={(e) => handleFormChange("concepto", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>RFC del Proveedor</Label>
                                        <Input
                                            placeholder="Ej. INMO800101XYZ"
                                            className="font-mono"
                                            value={form.rfc_proveedor}
                                            onChange={(e) => handleFormChange("rfc_proveedor", e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Fecha del Gasto</Label>
                                        <Input
                                            type="date"
                                            value={form.fecha}
                                            onChange={(e) => handleFormChange("fecha", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                    <Button variant="outline" onClick={() => { setIsNewOpen(false); setForm(emptyForm) }} disabled={isPending}>Cancelar</Button>
                                    <Button onClick={handleSaveGasto} disabled={isPending}>
                                        {isPending ? "Guardando..." : "Guardar Gasto"}
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
                                {filtered.length} gastos
                                {filtered.length !== gastos.length && ` filtrados de ${gastos.length}`}
                                {" — Total: "}{formatMXN(filtered.reduce((s, g) => s + Number(g.monto), 0))}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="size-7" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                    <ChevronLeft className="size-3.5" />
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Button
                                        key={p}
                                        variant="outline"
                                        size="sm"
                                        className={`h-7 min-w-7 px-2 text-xs ${p === page ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button variant="outline" size="icon" className="size-7" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                                    <ChevronRight className="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto max-h-[calc(100dvh-420px)]">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-5">Concepto</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead className="hidden md:table-cell">RFC Proveedor</TableHead>
                                    <TableHead className="hidden lg:table-cell">Fecha</TableHead>
                                    <TableHead className="text-right pr-5">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map((gasto) => (
                                    <TableRow key={gasto.gasto_id} className="cursor-pointer">
                                        <TableCell className="pl-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                    {getCategoriaIcon(gasto.categoria)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{gasto.concepto}</span>
                                                    <span className="text-[11px] text-muted-foreground md:hidden">{gasto.fecha}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] ${getCategoriaBadgeClass(gasto.categoria)}`}
                                            >
                                                {gasto.categoria}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-sm">
                                            {formatMXN(Number(gasto.monto))}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                                            {gasto.rfc_proveedor}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                                            {gasto.fecha}
                                        </TableCell>
                                        <TableCell className="text-right pr-5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() => setDetail(gasto)}
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
                <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Detalle del Gasto #{detail?.gasto_id}</DialogTitle>
                            <DialogDescription>{detail?.categoria}</DialogDescription>
                        </DialogHeader>
                        {detail && (
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-background border">
                                        {getCategoriaIcon(detail.categoria)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{detail.concepto}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{detail.categoria}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Monto</p>
                                        <p className="text-xl font-bold mt-0.5">{formatMXN(Number(detail.monto))}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Fecha</p>
                                        <p className="text-sm mt-0.5">{detail.fecha}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground">RFC del Proveedor</p>
                                        <p className="text-sm font-mono mt-0.5">{detail.rfc_proveedor}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground">Vinculado a Documentos</p>
                                        <Badge variant="secondary" className="text-[10px] mt-1">
                                            {gastos.find(g => g.gasto_id === detail.gasto_id)
                                                ? "Ver en Documentos → Organización"
                                                : "Sin documentos vinculados"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setDetail(null)}>Cerrar</Button>
                                    <Button variant="outline" onClick={() => setDetail(null)}>
                                        <Building2 className="mr-2 size-4" />
                                        Ver Documentos
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </>
    )
}
