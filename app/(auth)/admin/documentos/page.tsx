import Link from "next/link"
import { Plus } from "lucide-react"
import { DocumentosTable } from "@/app/components/documentos/documentos-table"
import { createClient } from "@supabase/supabase-js"

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function GestionDocumentosPage() {
  const { data: perfiles, error: perfilesError } = await supabaseServer
    .from("profiles")
    .select("id, roles(nombre)")

  if (perfilesError) {
    console.error("Error al obtener perfiles:", perfilesError)
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Documentos</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error al cargar perfiles.
        </div>
      </div>
    )
  }

  const admins = perfiles.filter(p => ["admin", "adminRh"].includes(p.roles?.nombre || ""))

  if (admins.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Documentos</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          No hay usuarios con rol de admin.
        </div>
      </div>
    )
  }

  const [documentosResult, documentosEmpleadosResult, todosEmpleadosResult] = await Promise.all([
    supabaseServer
      .from("documentos")
      .select("*, creador:profiles(nombre, email)")
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("documentos_empleados")
      .select("documento_id, empleado:profiles(id, nombre, email)"),
    supabaseServer
      .from("profiles")
      .select("id, nombre, email")
      .order("nombre"),
  ])

  const documentos = documentosResult.data || []
  const documentosEmpleados = documentosEmpleadosResult.data || []
  const todosEmpleados = todosEmpleadosResult.data || []

  if (documentosResult.error) console.error("Error al obtener documentos:", documentosResult.error)
  if (documentosEmpleadosResult.error) console.error("Error al obtener asignaciones:", documentosEmpleadosResult.error)

  const empleadosPorDocumento: Record<string, any[]> = {}
  documentosEmpleados.forEach((asignacion) => {
    if (!empleadosPorDocumento[asignacion.documento_id]) {
      empleadosPorDocumento[asignacion.documento_id] = []
    }
    empleadosPorDocumento[asignacion.documento_id].push(asignacion.empleado)
  })

  const documentosConEmpleados = documentos.map((doc) => ({
    ...doc,
    empleados: empleadosPorDocumento[doc.id] || [],
  }))

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Documentos</h1>
        <Link
          href="/admin/documentos/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Crear nuevo documento</span>
        </Link>
      </div>

      <DocumentosTable
        documentos={documentosConEmpleados}
        todosEmpleados={todosEmpleados}
      />
    </div>
  )
}
