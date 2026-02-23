"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    User,
    Mail,
    Phone,
    Building2,
    MapPin,
    FileText,
    Key,
    Clock,
    CheckCircle,
    Activity,
    Bell,
    Lock,
    Edit2,
    Save,
    Globe,
    Users,
    CalendarDays,
    Shield,
    AlertTriangle,
} from "lucide-react"

const activityLog = [
    {
        id: 1,
        accion: "Expediente KYC enviado",
        detalle: "Documentacion enviada para revision de cumplimiento",
        fecha: "2026-02-18 14:32",
        icon: FileText,
        color: "text-primary",
    },
    {
        id: 2,
        accion: "Alerta revisada",
        detalle: "ALT-003 - Coincidencia en lista PEP atendida",
        fecha: "2026-02-17 11:10",
        icon: AlertTriangle,
        color: "text-destructive",
    },
    {
        id: 3,
        accion: "Documento cargado",
        detalle: "Acta Constitutiva actualizada",
        fecha: "2026-02-16 16:55",
        icon: CheckCircle,
        color: "text-success",
    },
    {
        id: 4,
        accion: "Beneficiario registrado",
        detalle: "Nuevo miembro del consejo directivo agregado",
        fecha: "2026-02-15 09:20",
        icon: Users,
        color: "text-primary",
    },
    {
        id: 5,
        accion: "Perfil de organizacion actualizado",
        detalle: "Datos de contacto y mision actualizados",
        fecha: "2026-02-14 13:45",
        icon: Building2,
        color: "text-muted-foreground",
    },
]

const stats = [
    { label: "Documentos Activos", value: "8", icon: FileText, color: "text-primary" },
    { label: "Alertas Pendientes", value: "2", icon: AlertTriangle, color: "text-destructive" },
    { label: "Miembros Registrados", value: "14", icon: Users, color: "text-success" },
    { label: "Dias en Plataforma", value: "145", icon: CalendarDays, color: "text-muted-foreground" },
]

export default function PerfilPage() {
    const [editMode, setEditMode] = useState(false)
    const [saved, setSaved] = useState(false)

    // Representante / contacto de la OSC
    const [repForm, setRepForm] = useState({
        nombre: "Maria",
        apellido: "Alvarez",
        cargo: "Directora Ejecutiva",
        email: "maria.alvarez@fundacionesperanza.org",
        telefono: "+52 55 1234 5678",
    })

    // Datos de la organizacion
    const [orgForm, setOrgForm] = useState({
        nombre: "Fundacion Esperanza A.C.",
        tipo: "asociacion_civil",
        rfc: "FES200301ABC",
        cluni: "FESE200301ABC123",
        fechaConstitucion: "2020-03-01",
        mision: "Promovemos el desarrollo comunitario sustentable a traves de programas de educacion, salud y medio ambiente en comunidades vulnerables del sur de Mexico.",
        sitioWeb: "www.fundacionesperanza.org",
        estado: "Oaxaca",
        municipio: "Oaxaca de Juarez",
        sector: "desarrollo_comunitario",
    })

    function handleRepChange(field: string, value: string) {
        setRepForm((prev) => ({ ...prev, [field]: value }))
    }

    function handleOrgChange(field: string, value: string) {
        setOrgForm((prev) => ({ ...prev, [field]: value }))
    }

    function handleSave() {
        setEditMode(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <>
            <DashboardHeader
                title="Perfil de la Organizacion"
                description="Informacion y configuracion de tu OSC registrada"
            />

            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">

                {/* Organization + Rep Header Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                            {/* Org Avatar */}
                            <div className="relative shrink-0">
                                <Avatar className="size-20">
                                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
                                        FE
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 size-4 rounded-full bg-success border-2 border-card" />
                            </div>

                            {/* Org Info */}
                            <div className="flex flex-1 flex-col gap-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl font-bold text-foreground">
                                        {orgForm.nombre}
                                    </h2>
                                    <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-[10px]">
                                        Verificada
                                    </Badge>
                                    <Badge variant="secondary" className="text-[10px]">
                                        OSC Activa
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {orgForm.tipo === "asociacion_civil" ? "Asociacion Civil" :
                                        orgForm.tipo === "fundacion" ? "Fundacion" :
                                            orgForm.tipo === "institucion_asistencia_privada" ? "Institucion de Asistencia Privada" :
                                                "Organizacion de la Sociedad Civil"}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <User className="size-3" />
                                        Representada por:{" "}
                                        <span className="font-medium text-foreground ml-1">
                                            {repForm.nombre} {repForm.apellido}
                                        </span>
                                        , {repForm.cargo}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="size-3" />
                                        {orgForm.municipio}, {orgForm.estado}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="size-3" />
                                        Constituida el {orgForm.fechaConstitucion}
                                    </span>
                                </div>
                            </div>

                            {/* Edit Toggle */}
                            {!editMode ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 gap-2"
                                    onClick={() => setEditMode(true)}
                                >
                                    <Edit2 className="size-3.5" />
                                    Editar
                                </Button>
                            ) : (
                                <div className="flex gap-2 shrink-0">
                                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                                        Cancelar
                                    </Button>
                                    <Button size="sm" className="gap-2" onClick={handleSave}>
                                        <Save className="size-3.5" />
                                        Guardar
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mission statement */}
                        <div className="mt-5 rounded-lg bg-muted/50 px-4 py-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Mision</p>
                            <p className="text-sm text-foreground leading-relaxed">{orgForm.mision}</p>
                        </div>

                        {saved && (
                            <div className="mt-4 flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-xs text-success">
                                <CheckCircle className="size-3.5" />
                                Informacion actualizada correctamente
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Row */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0">
                                    <stat.icon className={`size-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="organizacion">
                    <TabsList>
                        <TabsTrigger value="organizacion" className="gap-2">
                            <Building2 className="size-3.5" />
                            Organizacion
                        </TabsTrigger>
                        <TabsTrigger value="representante" className="gap-2">
                            <User className="size-3.5" />
                            Representante
                        </TabsTrigger>
                        <TabsTrigger value="seguridad" className="gap-2">
                            <Lock className="size-3.5" />
                            Seguridad
                        </TabsTrigger>
                        <TabsTrigger value="actividad" className="gap-2">
                            <Activity className="size-3.5" />
                            Actividad
                        </TabsTrigger>
                        <TabsTrigger value="notificaciones" className="gap-2">
                            <Bell className="size-3.5" />
                            Notificaciones
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab: Organizacion */}
                    <TabsContent value="organizacion" className="mt-4">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base">Datos de la Organizacion</CardTitle>
                                <CardDescription>
                                    Informacion legal y de contacto de tu OSC registrada en la plataforma
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2 sm:col-span-2">
                                        <Label>Nombre Legal de la Organizacion</Label>
                                        <Input
                                            value={orgForm.nombre}
                                            disabled={!editMode}
                                            onChange={(e) => handleOrgChange("nombre", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Tipo de Figura Juridica</Label>
                                        <Select
                                            value={orgForm.tipo}
                                            onValueChange={(v) => handleOrgChange("tipo", v)}
                                            disabled={!editMode}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="asociacion_civil">Asociacion Civil (A.C.)</SelectItem>
                                                <SelectItem value="fundacion">Fundacion</SelectItem>
                                                <SelectItem value="institucion_asistencia_privada">Institucion de Asistencia Privada (I.A.P.)</SelectItem>
                                                <SelectItem value="sociedad_civil">Sociedad Civil (S.C.)</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Sector / Causa Principal</Label>
                                        <Select
                                            value={orgForm.sector}
                                            onValueChange={(v) => handleOrgChange("sector", v)}
                                            disabled={!editMode}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="desarrollo_comunitario">Desarrollo Comunitario</SelectItem>
                                                <SelectItem value="educacion">Educacion</SelectItem>
                                                <SelectItem value="salud">Salud</SelectItem>
                                                <SelectItem value="medio_ambiente">Medio Ambiente</SelectItem>
                                                <SelectItem value="derechos_humanos">Derechos Humanos</SelectItem>
                                                <SelectItem value="genero">Genero e Inclusion</SelectItem>
                                                <SelectItem value="infancia">Infancia y Juventud</SelectItem>
                                                <SelectItem value="discapacidad">Discapacidad</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>RFC</Label>
                                        <Input
                                            value={orgForm.rfc}
                                            disabled={!editMode}
                                            onChange={(e) => handleOrgChange("rfc", e.target.value)}
                                            placeholder="Ej. FES200301ABC"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>CLUNI</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                value={orgForm.cluni}
                                                disabled={!editMode}
                                                onChange={(e) => handleOrgChange("cluni", e.target.value)}
                                                placeholder="Clave Unica de Inscripcion al RFOSC"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Fecha de Constitucion</Label>
                                        <Input
                                            type="date"
                                            value={orgForm.fechaConstitucion}
                                            disabled={!editMode}
                                            onChange={(e) => handleOrgChange("fechaConstitucion", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Sitio Web</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                value={orgForm.sitioWeb}
                                                disabled={!editMode}
                                                onChange={(e) => handleOrgChange("sitioWeb", e.target.value)}
                                                placeholder="www.tuorganizacion.org"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="text-sm font-semibold mb-4">Ubicacion</h4>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <Label>Estado</Label>
                                            <Input
                                                value={orgForm.estado}
                                                disabled={!editMode}
                                                onChange={(e) => handleOrgChange("estado", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Municipio / Alcaldia</Label>
                                            <Input
                                                value={orgForm.municipio}
                                                disabled={!editMode}
                                                onChange={(e) => handleOrgChange("municipio", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex flex-col gap-2">
                                    <Label>Mision de la Organizacion</Label>
                                    <Textarea
                                        value={orgForm.mision}
                                        disabled={!editMode}
                                        onChange={(e) => handleOrgChange("mision", e.target.value)}
                                        className="min-h-[90px] resize-none"
                                        placeholder="Describe la mision y objetivos principales de tu organizacion..."
                                    />
                                </div>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Representante */}
                    <TabsContent value="representante" className="mt-4">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <User className="size-4" />
                                    Datos del Representante Legal / Enlace
                                </CardTitle>
                                <CardDescription>
                                    Persona responsable de administrar la cuenta en CumplAML
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label>Nombre(s)</Label>
                                        <Input
                                            value={repForm.nombre}
                                            disabled={!editMode}
                                            onChange={(e) => handleRepChange("nombre", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Apellido(s)</Label>
                                        <Input
                                            value={repForm.apellido}
                                            disabled={!editMode}
                                            onChange={(e) => handleRepChange("apellido", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Cargo en la Organizacion</Label>
                                        <Select
                                            value={repForm.cargo}
                                            onValueChange={(v) => handleRepChange("cargo", v)}
                                            disabled={!editMode}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Directora Ejecutiva">Directora / Director Ejecutivo</SelectItem>
                                                <SelectItem value="Presidenta">Presidenta / Presidente</SelectItem>
                                                <SelectItem value="Representante Legal">Representante Legal</SelectItem>
                                                <SelectItem value="Coordinadora de Cumplimiento">Coordinadora / Coordinador de Cumplimiento</SelectItem>
                                                <SelectItem value="Secretaria">Secretaria / Secretario</SelectItem>
                                                <SelectItem value="Tesorera">Tesorera / Tesorero</SelectItem>
                                                <SelectItem value="Otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Correo Electronico</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                value={repForm.email}
                                                disabled={!editMode}
                                                onChange={(e) => handleRepChange("email", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Telefono de Contacto</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                value={repForm.telefono}
                                                disabled={!editMode}
                                                onChange={(e) => handleRepChange("telefono", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="rounded-lg border border-border bg-muted/30 p-4 flex gap-3">
                                    <Shield className="size-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Nivel de Acceso</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Administrador de la organizacion — acceso completo al expediente, documentos y alertas
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Seguridad */}
                    <TabsContent value="seguridad" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Key className="size-4" />
                                        Cambiar Contrasena
                                    </CardTitle>
                                    <CardDescription>
                                        Usa una contrasena segura de al menos 8 caracteres
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Contrasena Actual</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Nueva Contrasena</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Confirmar Nueva Contrasena</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button size="sm">Actualizar Contrasena</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Shield className="size-4" />
                                        Sesiones Activas
                                    </CardTitle>
                                    <CardDescription>
                                        Dispositivos con sesion iniciada en tu cuenta
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    {[
                                        { device: "MacBook Pro — Chrome", location: "Oaxaca, MX", time: "Sesion actual", current: true },
                                        { device: "iPhone 15 — Safari", location: "Oaxaca, MX", time: "Hace 3 horas", current: false },
                                    ].map((session, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                                                    <User className="size-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{session.device}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {session.location} · {session.time}
                                                    </p>
                                                </div>
                                            </div>
                                            {session.current ? (
                                                <Badge variant="secondary" className="text-[10px]">Activa</Badge>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs h-7">
                                                    Cerrar
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Tab: Actividad */}
                    <TabsContent value="actividad" className="mt-4">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Activity className="size-4" />
                                    Historial de Actividad
                                </CardTitle>
                                <CardDescription>
                                    Ultimas acciones realizadas en CumplAML para tu organizacion
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-0">
                                    {activityLog.map((item, index) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-muted ${item.color}`}>
                                                    <item.icon className="size-4" />
                                                </div>
                                                {index < activityLog.length - 1 && (
                                                    <div className="w-px flex-1 bg-border my-1" />
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col pb-4 pt-1">
                                                <p className="text-sm font-medium text-foreground">{item.accion}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{item.detalle}</p>
                                                <p className="text-[11px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {item.fecha}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Notificaciones */}
                    <TabsContent value="notificaciones" className="mt-4">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Bell className="size-4" />
                                    Preferencias de Notificaciones
                                </CardTitle>
                                <CardDescription>
                                    Configura como y cuando recibes avisos sobre tu organizacion
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {[
                                    {
                                        titulo: "Alertas de Cumplimiento",
                                        desc: "Notificaciones cuando se detecta una alerta en tu expediente",
                                        activo: true,
                                    },
                                    {
                                        titulo: "Documentos por Vencer",
                                        desc: "Avisos 30 dias antes de que expire un documento requerido",
                                        activo: true,
                                    },
                                    {
                                        titulo: "Solicitudes de Informacion",
                                        desc: "Cuando el equipo de cumplimiento solicita informacion adicional",
                                        activo: true,
                                    },
                                    {
                                        titulo: "Actualizaciones Regulatorias",
                                        desc: "Cambios en la normativa ALD que afecten a tu organizacion",
                                        activo: false,
                                    },
                                    {
                                        titulo: "Resumen Mensual",
                                        desc: "Reporte del estado de cumplimiento de tu OSC cada mes",
                                        activo: true,
                                    },
                                ].map((notif, i) => (
                                    <div key={i} className="flex items-start justify-between gap-4 rounded-lg border p-4">
                                        <div>
                                            <p className="text-sm font-medium">{notif.titulo}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{notif.desc}</p>
                                        </div>
                                        <button
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${notif.activo ? "bg-primary" : "bg-input"
                                                }`}
                                            role="switch"
                                            aria-checked={notif.activo}
                                        >
                                            <span
                                                className={`pointer-events-none block size-4 rounded-full bg-background shadow-lg transition-transform ${notif.activo ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex justify-end pt-2">
                                    <Button size="sm">Guardar Preferencias</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
