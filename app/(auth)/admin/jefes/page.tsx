"use client"

import React, { useEffect, useState } from "react"
import { SolicitudFormBase } from "./form-base"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Mosaic } from "react-loading-indicators"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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
    const supabase = createClientComponentClient()

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
      <div className="flex flex-col items-center justify-center h-screen">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-center">
          {loading ? "Cargando..." : "Redirigiendo, por favor espere..."}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">Volver</h1>
      </div>

      <SolicitudFormBase title="Registro de jefes directos por área." onSubmit={handleSubmit}>
        <h2 className="text-center">Complete el formulario para dar de alta a jefes directos.</h2>
        <div className="bg-gray-100 p-4 rounded-md border space-y-4 mb-6 cursor-not-allowed">
          <h3 className="text-lg font-semibold">Datos del encargado a registro:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="fecha_solicitud">Fecha del registro</Label>
              <Input id="fecha_solicitud" name="fecha_solicitud" type="date" readOnly value={fechaActual} />
            </div>

            <div className="space-y-1">
              <Label>Nombre completo</Label>
              <Input readOnly value={perfil?.nombre || ""} />
            </div>

            <div className="space-y-1">
              <Label>Departamento</Label>
              <Input readOnly value={perfil?.departamento || ""} />
            </div>

            <div className="space-y-1">
              <Label>Puesto</Label>
              <Input readOnly value={perfil?.puesto || ""} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="id_empleado">Seleccione el jefe directo:</Label>
          <select
            id="id_empleado"
            name="id_empleado"
            required
            className="w-full border rounded-md p-2"
            defaultValue=""
          >
            <option value="" disabled>
              Seleccione un usuario
            </option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
        </div>
      </SolicitudFormBase>
    </div>
  )
}
