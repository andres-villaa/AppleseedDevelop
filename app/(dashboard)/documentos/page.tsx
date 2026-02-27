import { getDocumentosOrg, getDocumentosDonantes } from "@/lib/supabase/queries"
import { DocumentosClient } from "@/components/dashboard/documentos-client"

export default async function DocumentosPage() {
  const [docsOrg, docsDonante] = await Promise.all([
    getDocumentosOrg(),
    getDocumentosDonantes()
  ])

  return (
    <DocumentosClient
      docsOrg={docsOrg}
      docsDonante={docsDonante}
    />
  )
}
