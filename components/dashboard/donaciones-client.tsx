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
    TrendingUp,
    FileWarning,
    CircleCheck,
    CircleDot,
    ShieldAlert,
    User,
} from "lucide-react"
import type { Donacion, Donante } from "@/lib/types"

type DonacionExtendida = Donacion & { nombre_donante?: string }

function formatMXN(amount: number) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
    }).format(amount)
}

function umasEquivalentes(monto: number, valorUma: number) {
    if (!valorUma) return "0.0"
    return (monto / valorUma).toFixed(1)
}

function getMetodoBadge(metodo: Donacion["metodo_pago"]) {
    const map: Record<Donacion["metodo_pago"], string> = {
        transferencia: "Transferencia",
        cheque: "Cheque",
        efectivo: "Efectivo",
        especie: "Especie",
    }
    return (
        <Badge variant="outline" className="text-[10px]">
            {map[metodo]}
        </Badge>
    )
}

const ITEMS_PER_PAGE = 7

export function DonacionesClient({
    donaciones,
    donantes,
    umaActual
}: {
    donaciones: DonacionExtendida[];
    donantes: Donante[];
    umaActual: { uma_id: number; year: number; valor: number }
}) {
    const [search, setSearch] = useState("")
    const [filterMetodo, setFilterMetodo] = useState("all")
    const [filterPLD, setFilterPLD] = useState("all")
    const [page, setPage] = useState(1)
    const [isNewOpen, setIsNewOpen] = useState(false)
    const [detail, setDetail] = useState<DonacionExtendida | null>(null)

    const filtered = donaciones.filter((d) => {
        const matchSearch =
            (d.nombre_donante || "").toLowerCase().includes(search.toLowerCase()) ||
            d.donacion_id.toString().includes(search)
        const matchMetodo = filterMetodo === "all" || d.metodo_pago === filterMetodo
        const matchPLD =
            filterPLD === "all" ||
            (filterPLD === "requiere" && d.requiere_reporte_pld) ||
            (filterPLD === "pendiente" && d.requiere_reporte_pld && !d.reportada_pld) ||
            (filterPLD === "reportada" && d.reportada_pld)
        return matchSearch && matchMetodo && matchPLD
    })

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const totalRecaudado = donaciones.reduce((s, d) => s + Number(d.monto), 0)
    const pendientesPLD = donaciones.filter((d) => d.requiere_reporte_pld && !d.reportada_pld).length
    const pendientesSAT = donaciones.filter((d) => !d.reportada_sat).length
    const totalRequierenReporte = donaciones.filter((d) => d.requiere_reporte_pld).length

    return (
        <>
            <DashboardHeader
                title="Donaciones"
                description="Registro y seguimiento de donaciones recibidas — Control PLD y SAT"
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <TrendingUp className="size-3.5" />
                                Total Recaudado
                            </div>
                            <p className="text-xl font-bold">{formatMXN(totalRecaudado)}</p>
                            <p className="text-[11px] text-muted-foreground mt-1">{donaciones.length} donaciones</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-warning">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <CircleDot className="size-3.5" />
                                Requieren Reporte PLD
                            </div>
                            <p className="text-xl font-bold">{totalRequierenReporte}</p>
                            <p className="text-[11px] text-muted-foreground mt-1">≥ 645 UMAs ({formatMXN(645 * (umaActual?.valor || 108.57))})</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-destructive">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <FileWarning className="size-3.5" />
                                Pendientes PLD
                            </div>
                            <p className="text-xl font-bold">{pendientesPLD}</p>
                            <p className="text-[11px] text-destructive mt-1">Sin reportar a SHCP</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-success">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <CircleCheck className="size-3.5" />
                                Reportadas SAT
                            </div>
                            <p className="text-xl font-bold">{donaciones.filter(d => d.reportada_sat).length}</p>
                            <p className="text-[11px] text-muted-foreground mt-1">{pendientesSAT} pendientes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por donante o ID..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                className="pl-9 h-9"
                            />
                        </div>
                        <Select value={filterMetodo} onValueChange={(v) => { setFilterMetodo(v); setPage(1) }}>
                            <SelectTrigger className="w-[160px] h-9">
                                <Filter className="mr-2 size-3.5" />
                                <SelectValue placeholder="Método de pago" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los métodos</SelectItem>
                                <SelectItem value="transferencia">Transferencia</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                <SelectItem value="especie">Especie</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterPLD} onValueChange={(v) => { setFilterPLD(v); setPage(1) }}>
                            <SelectTrigger className="w-[180px] h-9">
                                <Filter className="mr-2 size-3.5" />
                                <SelectValue placeholder="Estado PLD" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="requiere">Requieren reporte</SelectItem>
                                <SelectItem value="pendiente">PLD pendiente</SelectItem>
                                <SelectItem value="reportada">Reportadas PLD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-9">
                                <Plus className="mr-2 size-4" />
                                Nueva Donación
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Registrar Nueva Donación</DialogTitle>
                                <DialogDescription>
                                    Ingresa los datos de la donación recibida. El sistema calculará automáticamente si requiere reporte PLD.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 flex flex-col gap-2">
                                        <Label>Donante</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar donante" /></SelectTrigger>
                                            <SelectContent>
                                                {donantes.map((d) => (
                                                    <SelectItem key={d.donante_id} value={d.donante_id}>
                                                        {d.nombre_razon_social}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Monto (MXN)</Label>
                                        <Input type="number" placeholder="Ej. 50000" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Método de Pago</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="transferencia">Transferencia</SelectItem>
                                                <SelectItem value="cheque">Cheque</SelectItem>
                                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                                <SelectItem value="especie">Especie</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Fecha de Donación</Label>
                                        <Input type="date" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Valor UMA Aplicado</Label>
                                        <Input
                                            type="number"
                                            value={umaActual?.valor || 108.57}
                                            readOnly
                                            className="bg-muted text-muted-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="rounded-md border border-warning/40 bg-warning/5 p-3 text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">Umbral PLD 2026:</span>{" "}
                                    {formatMXN(645 * (umaActual?.valor || 108.57))} (645 UMAs × ${(umaActual?.valor || 108.57)})
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                    <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancelar</Button>
                                    <Button onClick={() => setIsNewOpen(false)}>Guardar Donación</Button>
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
                                {filtered.length} donaciones
                                {filtered.length !== donaciones.length && ` filtradas de ${donaciones.length}`}
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
                                    <TableHead>Donante</TableHead>
                                    <TableHead className="hidden md:table-cell">Fecha</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead className="hidden lg:table-cell">UMAs</TableHead>
                                    <TableHead className="hidden md:table-cell">Método</TableHead>
                                    <TableHead>PLD</TableHead>
                                    <TableHead className="hidden lg:table-cell">SAT</TableHead>
                                    <TableHead className="text-right pr-5">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map((don) => (
                                    <TableRow key={don.donacion_id} className="cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                    <User className="size-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{don.nombre_donante}</span>
                                                    <span className="text-[11px] text-muted-foreground">{don.donante_id}</span>
                                                </div>
                                                {(() => {
                                                    const donante = donantes.find(d => d.donante_id === don.donante_id)
                                                    return donante?.es_pep ? (
                                                        <ShieldAlert className="size-3.5 text-destructive shrink-0" aria-label="PEP" />
                                                    ) : null
                                                })()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                            {don.fecha}
                                        </TableCell>
                                        <TableCell className="font-semibold text-sm">
                                            {formatMXN(Number(don.monto))}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                                            {umasEquivalentes(Number(don.monto), Number(don.valor_uma_aplicado))} UMAs
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {getMetodoBadge(don.metodo_pago)}
                                        </TableCell>
                                        <TableCell>
                                            {don.requiere_reporte_pld ? (
                                                don.reportada_pld ? (
                                                    <Badge variant="outline" className="border-success text-success text-[10px]">
                                                        Reportada
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="text-[10px]">
                                                        Pendiente
                                                    </Badge>
                                                )
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    N/A
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {don.reportada_sat ? (
                                                <Badge variant="outline" className="border-success text-success text-[10px]">
                                                    Reportada
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    Pendiente
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() => setDetail(don)}
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
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Detalle de Donación #{detail?.donacion_id}</DialogTitle>
                            <DialogDescription>{detail?.nombre_donante}</DialogDescription>
                        </DialogHeader>
                        {detail && (
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Monto</p>
                                        <p className="text-xl font-bold mt-0.5">{formatMXN(Number(detail.monto))}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Equivalente UMA</p>
                                        <p className="text-sm font-medium mt-0.5">
                                            {umasEquivalentes(Number(detail.monto), Number(detail.valor_uma_aplicado))} UMAs
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">@ ${detail.valor_uma_aplicado}/UMA</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Fecha</p>
                                        <p className="text-sm mt-0.5">{detail.fecha}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Método de Pago</p>
                                        <div className="mt-1">{getMetodoBadge(detail.metodo_pago)}</div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Estado de Cumplimiento</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg border p-3">
                                            <p className="text-xs text-muted-foreground mb-2">Reporte PLD (SHCP)</p>
                                            {detail.requiere_reporte_pld ? (
                                                detail.reportada_pld ? (
                                                    <>
                                                        <Badge variant="outline" className="border-success text-success text-[10px]">Reportada</Badge>
                                                        {detail.fecha_reporte_pld && (
                                                            <p className="text-[11px] text-muted-foreground mt-1">{detail.fecha_reporte_pld}</p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Badge variant="destructive" className="text-[10px]">Pendiente</Badge>
                                                )
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px]">No requerido</Badge>
                                            )}
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <p className="text-xs text-muted-foreground mb-2">Reporte SAT</p>
                                            {detail.reportada_sat ? (
                                                <Badge variant="outline" className="border-success text-success text-[10px]">Reportada</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px]">Pendiente</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setDetail(null)}>Cerrar</Button>
                                    {detail.requiere_reporte_pld && !detail.reportada_pld && (
                                        <Button onClick={() => setDetail(null)}>
                                            Marcar como Reportada (PLD)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </>
    )
}
