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

export async function updateDonanteEstatus(donanteId: string, estatus: "completo" | "incompleto" | "en_revision") {
    const supabase = await createClient()

    const { error } = await supabase
        .from("Donantes")
        .update({ estatus_expediente: estatus })
        .eq("donante_id", donanteId)

    if (error) {
        console.error("Error updating donante status:", error)
        return { error: error.message }
    }

    revalidatePath("/dashboard")
    revalidatePath("/registros")

    return { success: true }
}

export async function updateDonante(formData: FormData) {
    const supabase = await createClient()

    const donante_id = formData.get("donante_id") as string
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

    if (!donante_id || !nombre || !tipo_persona || !rfc || !email || !regimen_fiscal || !codigo_postal) {
        return { error: "Los campos básicos son obligatorios" }
    }

    const { data, error } = await supabase
        .from("Donantes")
        .update({
            nombre_razon_social: nombre,
            tipo_persona: tipo_persona as "fisica" | "moral",
            rfc,
            curp: curp || null,
            email,
            regimen_fiscal,
            codigo_postal,
            direccion,
            actividad_economica,
            es_pep
        })
        .eq("donante_id", donante_id)
        .select()
        .single()

    if (error) {
        console.error("Error updating donante:", error)
        return { error: error.message }
    }

    revalidatePath("/dashboard")
    revalidatePath("/registros")

    return { success: true, data }
}

export async function registerOrganizacion(formData: FormData) {
    const supabase = await createClient()

    const nombre = formData.get("nombre") as string
    const razon_social = formData.get("razon_social") as string
    const rfc = formData.get("rfc") as string
    const cluni = formData.get("cluni") as string
    const email = formData.get("email") as string
    const contrasena = formData.get("contrasena") as string

    if (!nombre || !razon_social || !rfc || !email || !contrasena) {
        return { error: "Los campos basicos son obligatorios" }
    }

    // Attempt to register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: contrasena,
        options: {
            data: {
                nombre_organizacion: nombre,
                rfc
            }
        }
    })

    if (authError) {
        console.error("Error signing up user:", authError)
        return { error: authError.message }
    }

    const orgId = authData.user?.id

    if (!orgId) {
        return { error: "No se pudo crear el usuario en el sistema de autenticacion." }
    }

    // Insert into Organizaciones table (using the auth user id if possible)
    const { error: dbError } = await supabase
        .from("Organizaciones")
        .insert({
            org_id: orgId,
            nombre,
            razon_social,
            rfc,
            cluni: cluni || null,
            email,
            contrasena
        })

    if (dbError) {
        console.error("Error inserting organizacion:", dbError)
        return { error: dbError.message }
    }

    return { success: true }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
}

export async function signIn(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get("email") as string
    const contrasena = formData.get("contrasena") as string

    if (!email || !contrasena) {
        return { error: "Correo electrónico y contraseña son obligatorios" }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password: contrasena,
    })

    if (error) {
        console.error("Error signing in:", error)
        return { error: "Credenciales inválidas" }
    }

    revalidatePath("/dashboard")
    return { success: true }
}
