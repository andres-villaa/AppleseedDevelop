// Tipos centralizados que mapean el esquema de base de datos

export interface Organizacion {
    org_id: string
    nombre: string
    razon_social: string
    rfc: string
    cluni: string
    email: string
    contrasena?: string // Solo manejado server-side; opcional en frontend
    created_at: string
}

export interface Donante {
    donante_id: string
    org_id: string
    tipo_persona: "fisica" | "moral"
    nombre_razon_social: string
    rfc: string
    curp?: string
    regimen_fiscal: string
    codigo_postal: string
    direccion: string
    email: string
    actividad_economica: string
    es_pep: boolean
    estatus_expediente: "completo" | "incompleto" | "en_revision"
    donacion_acumulada: number
    created_at: string
}

export interface Donacion {
    donacion_id: number
    donante_id: string
    org_id: string
    monto: number
    fecha: string
    metodo_pago: "transferencia" | "cheque" | "efectivo" | "especie"
    valor_uma_aplicado: number
    requiere_reporte_pld: boolean
    reportada_pld: boolean
    fecha_reporte_pld?: string
    reportada_sat: boolean
}

export interface Gasto {
    gasto_id: number
    org_id: string
    categoria: string
    concepto: string
    monto: number
    rfc_proveedor: string
    fecha: string
}

export interface DocumentoOrg {
    docs_id: number
    org_id: string
    gasto_id?: number
    titulo: string
    tipo_archivo: string
    ruta_archivo: string
    numero_operacion_sat?: string
    uuid_fiscal?: string
    fecha_subida: string
    fecha_vencimiento: string
}

export interface DocumentoDonante {
    docd_id: number
    org_id: string
    donante_id: string
    donacion_id?: number
    tipo_documento: string
    ruta_archivo: string
    fecha_subida: string
    fecha_vencimiento: string
    // Campos de UI (calculados / join)
    nombre_donante?: string
}

export interface AlertaCumplimiento {
    alerta_id: number
    organizacion_id: string
    titulo: string
    mensaje: string
    tipo_alerta: "donacion_inusual" | "pep" | "expediente_incompleto" | "reporte_pendiente" | "documento_vencido"
    atendida: boolean
    created_at: string
    // Campo de UI (join con Donantes)
    donante_nombre?: string
}
