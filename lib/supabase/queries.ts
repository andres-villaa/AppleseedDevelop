import { createClient } from './server'
import type {
    Donante,
    Donacion,
    Gasto,
    AlertaCumplimiento,
    DocumentoOrg,
    DocumentoDonante
} from '../types'

/**
 * Nota: Estas consultas asumen que se está ejecutando en el contexto 
 * de una petición del servidor (Server Component, Route Handler, Server Action).
 */

export async function getDonantes(): Promise<Donante[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('Donantes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching donantes:', error)
        return []
    }
    return data || []
}

export async function getDonaciones(): Promise<(Donacion & { nombre_donante?: string })[]> {
    const supabase = await createClient()

    // Hacemos un join con Donantes para obtener el nombre
    const { data, error } = await supabase
        .from('Donaciones')
        .select(`
            *,
            Donantes (
                nombre_razon_social
            )
        `)
        .order('fecha', { ascending: false })

    if (error) {
        console.error('Error fetching donaciones:', error)
        return []
    }

    // Aplanamos el resultado para que coincida con el tipo esperado por los componentes
    return (data || []).map((d: any) => ({
        ...d,
        nombre_donante: d.Donantes?.nombre_razon_social || 'Desconocido'
    }))
}

export async function getGastos(): Promise<Gasto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('Gastos')
        .select('*')
        .order('fecha', { ascending: false })

    if (error) {
        console.error('Error fetching gastos:', error)
        return []
    }
    return data || []
}

export async function getAlertas(): Promise<AlertaCumplimiento[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('Alertas_Cumplimiento')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching alertas:', error)
        return []
    }
    return data || []
}

export async function getUMAActual(): Promise<{ uma_id: number; year: number; valor: number }> {
    try {
        const response = await fetch('https://valoresuma.com.mx/api/v1/uma', {
            next: { revalidate: 86400 } // Cachear por 24 horas para no saturar la API
        })

        if (response.ok) {
            const json = await response.json()
            const currentYear = new Date().getFullYear()
            const match = json.data.find((d: any) => d.year === currentYear) || json.data[0]

            if (match) {
                return {
                    uma_id: match.year,
                    year: match.year,
                    valor: match.daily
                }
            }
        }
    } catch (e) {
        console.error('Error fetching UMA from API:', e)
    }

    // Si la API falla, devolvemos un valor default seguro
    console.warn('API de UMA no disponible, utilizando valor default (fallback local).')
    return { uma_id: 1, year: new Date().getFullYear(), valor: 113.14 } // Ajustar valor según corresponda al año
}

export async function getDocumentosOrg(): Promise<DocumentoOrg[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('Documentos_Org')
        .select('*')
        .order('fecha_subida', { ascending: false })

    if (error) {
        console.error('Error fetching docs org:', error)
        return []
    }
    return data || []
}

export async function getDocumentosDonantes(): Promise<(DocumentoDonante & { nombre_donante?: string })[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('Documentos_Donantes')
        .select(`
            *,
            Donantes (
                nombre_razon_social
            )
        `)
        .order('fecha_subida', { ascending: false })

    if (error) {
        console.error('Error fetching docs donantes:', error)
        return []
    }

    return (data || []).map((d: any) => ({
        ...d,
        nombre_donante: d.Donantes?.nombre_razon_social || 'Desconocido'
    }))
}
