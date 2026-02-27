import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
    const supabase = await createClient()

    // Intentamos obtener los datos de la tabla "Organizaciones"
    const { data, error } = await supabase.from('Organizaciones').select('*')

    return (
        <div className="p-10 font-sans">
            <h1 className="text-2xl font-bold mb-4">Prueba de Conexión a Supabase</h1>

            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error conectando: </strong>
                    <span className="block sm:inline">{error.message}</span>
                </div>
            ) : (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">¡Conexión Exitosa! </strong>
                    <span className="block sm:inline">Se encontraron {data?.length || 0} registros.</span>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Datos Crudos:</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm text-gray-800">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    )
}
