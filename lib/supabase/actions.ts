"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "./server"

export async function addDonacion(formData: FormData) {
    const supabase = await createClient()

    const donante_id = formData.get("donante_id") as string
    const monto = Number(formData.get("monto"))
    const metodo_pago = formData.get("metodo_pago") as string
    const fecha = formData.get("fecha") as string
    const valor_uma_aplicado = Number(formData.get("valor_uma_aplicado"))

    if (!donante_id || !monto || !metodo_pago || !fecha || !valor_uma_aplicado) {
        return { error: "Todos los campos son obligatorios" }
    }

    // Calcula si requiere PLD (>= 645 UMAs)
    const requiere_reporte_pld = (monto >= (645 * valor_uma_aplicado))

    const { data, error } = await supabase
        .from("Donaciones")
        .insert({
            org_id: "11111111-1111-1111-1111-111111111111", // Default to the seed Org ID for now
            donante_id,
            monto,
            metodo_pago,
            fecha,
            valor_uma_aplicado,
            requiere_reporte_pld,
            reportada_pld: false,
            reportada_sat: false
        })
        .select()
        .single()

    if (error) {
        console.error("Error inserting donacion:", error)
        return { error: error.message }
    }

    revalidatePath("/dashboard")
    revalidatePath("/donaciones")

    return { success: true, data }
}

export async function addGasto(formData: FormData) {
    const supabase = await createClient()

    const categoria = formData.get("categoria") as string
    const concepto = formData.get("concepto") as string
    const monto = Number(formData.get("monto"))
    const rfc_proveedor = formData.get("rfc_proveedor") as string
    const fecha = formData.get("fecha") as string

    if (!categoria || !concepto || !monto || !rfc_proveedor || !fecha) {
        return { error: "Todos los campos son obligatorios" }
    }

    const { data, error } = await supabase
        .from("Gastos")
        .insert({
            org_id: "11111111-1111-1111-1111-111111111111",
            categoria,
            concepto,
            monto,
            rfc_proveedor,
            fecha,
        })
        .select()
        .single()

    if (error) {
        console.error("Error inserting gasto:", error)
        return { error: error.message }
    }

    revalidatePath("/gastos")
    revalidatePath("/dashboard")

    return { success: true, data }
}

export async function markAsReportedPLD(donacionId: number) {
    const supabase = await createClient()

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    const { error } = await supabase
        .from("Donaciones")
        .update({
            reportada_pld: true,
            fecha_reporte_pld: today
        })
        .eq("donacion_id", donacionId)

    if (error) {
        console.error("Error updating donacion:", error)
        return { error: error.message }
    }

    revalidatePath("/donaciones")
    revalidatePath("/dashboard")

    return { success: true }
}

export async function addDonante(formData: FormData) {
    const supabase = await createClient()

    const nombre = formData.get("nombre") as string
    const tipo_persona = formData.get("tipo_persona") as string
    const rfc = formData.get("rfc") as string
    const curp = formData.get("curp") as string
    const email = formData.get("email") as string
    const regimen_fiscal = formData.get("regimen_fiscal") as string
    const codigo_postal = formData.get("codigo_postal") as string
    const direccion = formData.get("direccion") as string
    const actividad_economica = formData.get("actividad_economica") as string
    const es_pep = formData.get("es_pep") === "on" || formData.get("es_pep") === "true"

    if (!nombre || !tipo_persona || !rfc || !email || !regimen_fiscal || !codigo_postal) {
        return { error: "Los campos básicos son obligatorios" }
    }

    const { data, error } = await supabase
        .from("Donantes")
        .insert({
            org_id: "11111111-1111-1111-1111-111111111111", // Default to the seed Org ID for now
            nombre_razon_social: nombre,
            tipo_persona: tipo_persona as "fisica" | "moral",
            rfc,
            curp: curp || null,
            email,
            regimen_fiscal,
            codigo_postal,
            direccion,
            actividad_economica,
            es_pep,
            estatus_expediente: "en_revision", // Default status for new donors
            donacion_acumulada: 0
        })
        .select()
        .single()

    if (error) {
        console.error("Error inserting donante:", error)
        return { error: error.message }
    }

    revalidatePath("/dashboard")
    revalidatePath("/registros")

    return { success: true, data }
}
