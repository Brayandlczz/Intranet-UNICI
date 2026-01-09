"use client"

import React, { useEffect, useState } from "react"
import { SolicitudFormBase } from "./form-base"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Mosaic } from "react-loading-indicators"
import { supabase } from "@/utils/supabase/client" 

export default function SolicitudCumpleanosForm() {
  const [perfil, setPerfil] = useState<null | {
    id: string
    nombre: string
    departamento: string
    puesto: string
    fecha_nacimiento: string
  }>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [habilitado, setHabilitado] = useState(false)
  const router = useRouter()
  const fechaActual = new Date()

  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  useEffect(() => {

    const fetchPerfil = async () => {
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

      const { data, error } = await supabase
        .from("profiles")
        .select("id, nombre, departamento, puesto, fecha_nacimiento")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error al obtener perfil:", error)
        setError("No se pudo cargar el perfil del usuario.")
      } else if (!data) {
        setError("No se encontró el perfil del usuario.")
      } else {
        setPerfil(data)
        if (data.fecha_nacimiento) {
          verificarHabilitado(data.fecha_nacimiento)
        }
      }

      setLoading(false)
    }

    const verificarHabilitado = (fechaNacimientoStr: string) => {
      const fechaNacimiento = new Date(fechaNacimientoStr)
      const anioActual = fechaActual.getFullYear()

      const fechaCumpleanos = new Date(anioActual, fechaNacimiento.getMonth(), fechaNacimiento.getDate())
      const fechaInicio = new Date(fechaCumpleanos)
      fechaInicio.setDate(fechaCumpleanos.getDate() - 15)

      if (fechaActual >= fechaInicio && fechaActual <= fechaCumpleanos) {
        setHabilitado(true)
      } else {
        setHabilitado(false)
      }
    }

    fetchPerfil()
  }, [])

  const handleSubmit = async (formData: any) => {
    if (!habilitado) {
      alert("No puedes levantar la solicitud fuera del periodo permitido.")
      return { success: false, message: "Solicitud bloqueada fuera del periodo permitido" }
    }


    if (!perfil) {
      return { success: false, message: "No se pudo obtener el perfil del usuario" }
    }

    setIsSubmitting(true)

    try {
      const { fecha_cumpleaños, fecha_dia_libre, motivo } = formData

      const payload = {
        empleado_id: perfil.id,
        fecha_solicitud: formatDateLocal(fechaActual),
        fecha_cumpleaños,
        fecha_dia_libre,
        motivo,
        estado: "pendiente",
      }

      const { error } = await supabase.from("solicitud_cumpleaños").insert([payload])

      if (error) {
        console.error("Error al insertar en solicitud_cumpleaños:", error?.message || error)
        setIsSubmitting(false)
        return { success: false, message: "Error al guardar la solicitud." }
      }

      setTimeout(() => {
        router.push("/solicitudes")
      }, 1500)

      return { success: true, message: "Solicitud guardada correctamente." }
    } catch (error: any) {
      console.error("Error inesperado:", error)
      setIsSubmitting(false)
      return {
        success: false,
        message: error.message || "Error inesperado al crear la solicitud",
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-center">Cargando, por favor espere...</p>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-center">Redirigiendo, por favor espere...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.push("/solicitudes")}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">Volver</h1>
      </div>

      {!habilitado ? (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
          <p>
            No puedes levantar la solicitud fuera del período permitido (15 días previos a tu fecha de cumpleaños
            hasta el día de tu cumpleaños).
          </p>
        </div>
      ) : (
        <SolicitudFormBase title="Solicitud de permiso por día de cumpleaños" onSubmit={handleSubmit}>
          <h2 className="text-center">Complete el formulario para solicitar tu día por cumpleaños.</h2>
          <div className="bg-gray-100 p-4 rounded-md border space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Datos del solicitante</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="fecha_solicitud">Fecha de solicitud</Label>
                <Input
                  id="fecha_solicitud"
                  name="fecha_solicitud"
                  type="date"
                  readOnly
                  disabled
                  value={formatDateLocal(fechaActual)}
                />
              </div>

              <div className="space-y-1">
                <Label>Nombre completo</Label>
                <Input readOnly disabled value={perfil?.nombre || ""} />
              </div>

              <div className="space-y-1">
                <Label>Departamento</Label>
                <Input readOnly disabled value={perfil?.departamento || ""} />
              </div>

              <div className="space-y-1">
                <Label>Puesto</Label>
                <Input readOnly disabled value={perfil?.puesto || ""} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_cumpleaños">Fecha de nacimiento</Label>
              <Input
                id="fecha_cumpleaños"
                name="fecha_cumpleaños"
                type="date"
                readOnly
                disabled
                value={perfil?.fecha_nacimiento ? formatDateLocal(new Date(perfil.fecha_nacimiento)) : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_dia_libre">Fecha para tomar el día libre</Label>
              <Input
                id="fecha_dia_libre"
                name="fecha_dia_libre"
                type="date"
                readOnly
                disabled
                value={
                  perfil?.fecha_nacimiento
                    ? (() => {
                        const nacimiento = new Date(perfil.fecha_nacimiento)
                        const actual = new Date()
                        const diaLibre = new Date(
                          actual.getFullYear(),
                          nacimiento.getMonth(),
                          nacimiento.getDate()
                        )
                        return formatDateLocal(diaLibre)
                      })()
                    : ""
                }
              />
            </div>
          </div>
        </SolicitudFormBase>
      )}
    </div>
  )
}
