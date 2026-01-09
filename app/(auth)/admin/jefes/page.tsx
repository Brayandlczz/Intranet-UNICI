"use client"

import React, { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, UserCheck, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { Mosaic } from "react-loading-indicators"
import { supabase } from "@/utils/supabase/client" 

export default function SolicitudJefesForm() {
  const [perfil, setPerfil] = useState<null | {
    id: string
    nombre: string
    departamento: string
    puesto: string
  }>(null)

  const [usuarios, setUsuarios] = useState<{ id: string; nombre: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const fechaActual = new Date().toISOString().split("T")[0]

  useEffect(() => {

    const fetchPerfilYUsuarios = async () => {
      setLoading(true)
      setError(null)

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error("Error al obtener usuario:", authError)
        setError("No se pudo obtener el usuario. Intente nuevamente.")
        setLoading(false)
        return
      }

      const { data: perfilData, error: perfilError } = await supabase
        .from("profiles")
        .select("id, nombre, departamento, puesto")
        .eq("id", user.id)
        .single()

      if (perfilError || !perfilData) {
        console.error("Error al obtener perfil:", perfilError)
        setError("No se pudo cargar el perfil del usuario.")
        setLoading(false)
        return
      }

      setPerfil(perfilData)

      const { data: usuariosData, error: usuariosError } = await supabase
        .from("profiles")
        .select("id, nombre")
        .order("nombre", { ascending: true })

      if (usuariosError) {
        console.error("Error al obtener usuarios:", usuariosError)
        setError("No se pudo cargar la lista de usuarios.")
      } else {
        setUsuarios(usuariosData || [])
      }

      setLoading(false)
    }

    fetchPerfilYUsuarios()
  }, [])

const handleSubmit = async (formData: any): Promise<{ success: boolean; message: string }> => {
  const supabase = createClientComponentClient()
  setIsSubmitting(true)

  try {
    const { id_empleado } = formData

    if (!id_empleado) {
      console.error("ID de empleado no proporcionado.")
      setIsSubmitting(false)
      return { success: false, message: "ID de empleado no proporcionado." }
    }

    const payload = { id_empleado }
    console.log("Datos a insertar:", payload)

    const { error } = await supabase.from("jefes_directos").insert([payload])

    if (error) {
      console.error("Error al insertar en jefes_directos:", error.message || error)
      setIsSubmitting(false)
      return { success: false, message: error.message || "Error al insertar en la base de datos." }
    }

    setTimeout(() => {
      router.push("/admin/jefes")
      setIsSubmitting(false)
    }, 1500)

    return { success: true, message: "Solicitud enviada correctamente." }
  } catch (error: any) {
    console.error("Error inesperado:", error)
    setIsSubmitting(false)
    return { success: false, message: error.message || "Error inesperado." }
  }
}

  if (isSubmitting || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-center text-lg font-semibold">
          {loading ? "Cargando información..." : "Procesando solicitud, por favor espere..."}
        </p>
      </div>
    )
  }

  return (
    <div className="max-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-blue-200"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Designación de Jefes Directos | INTRANET</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Gestiona la designación de jefes y jerarquía institucional</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col items-center gap-3">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Formulario de Designación</h2>
              <p className="text-gray-600 text-sm">Complete el formulario para designar jefes directos por área</p>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center">
                  <Label htmlFor="id_empleado" className="text-lg font-semibold text-gray-900">
                    Seleccione un Usuario para Designar como Jefe
                  </Label>
                  <p className="text-gray-600 text-sm mt-1">
                    Elija del listado el empleado que será designado como jefe directo
                  </p>
                </div>
              </div>

              <select
                id="id_empleado"
                name="id_empleado"
                required
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300"
                defaultValue=""
              >
                <option value="" disabled className="text-gray-500">
                  Seleccione un usuario del listado
                </option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id} className="text-gray-900">
                    {usuario.nombre}
                  </option>
                ))}
              </select>

              {usuarios.length > 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Total de usuarios disponibles: <span className="font-semibold text-blue-600">{usuarios.length}</span>
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <UserCheck className="w-5 h-5" />
                Designar Jefe Directo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
