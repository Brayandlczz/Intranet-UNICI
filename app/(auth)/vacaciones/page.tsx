"use client"

import React, { useEffect, useState } from "react"
import { SolicitudFormBase } from "./form-base"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, User, Building, Briefcase, FileText, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Mosaic } from "react-loading-indicators"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SolicitudVacacionesForm() {
  const [perfil, setPerfil] = useState<null | {
    id: string
    nombre: string
    departamento: string
    puesto: string
  }>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const fechaActual = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const supabase = createClientComponentClient()

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
        .select("id, nombre, departamento, puesto")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error al obtener perfil:", error)
        setError("No se pudo cargar el perfil del usuario.")
      } else if (!data) {
        setError("No se encontró el perfil del usuario.")
      } else {
        setPerfil(data)
      }

      setLoading(false)
    }

    fetchPerfil()
  }, [])

const handleSubmit = async (formData: any) => {
  const supabase = createClientComponentClient()

  if (!perfil) {
    return { success: false, message: "No se pudo obtener el perfil del usuario" }
  }
  
  setIsSubmitting(true)

  try {
    const { fecha_inicio, fecha_fin, dias_solicitados, motivo } = formData

    const payload = {
      empleado_id: perfil.id,
      fecha_solicitud: fechaActual,
      fecha_inicio,
      fecha_fin, 
      dias_solicitados,
      motivo,
      estado: "pendiente",
    }

    console.log("Datos a insertar:", payload)

    const { error } = await supabase.from("solicitud_vacaciones").insert([payload])

    if (error) {
      console.error("Error al insertar en solicitud_vacaciones:", error?.message || error)
      setIsSubmitting(false)
      return { success: false, message: "Error al guardar la solicitud." }
    }

    setTimeout(() => {
      router.push("/vacaciones")
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

  if (loading){
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Mosaic color="#2464ec" size="medium" />
          <p className="mt-4 text-gray-600 text-center">Cargando datos del solicitante...</p>
      </div>
    )
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
    <div className="min-h-screen  via-white to-indigo-50 py-5 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-1">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group"
            aria-label="Volver"
          >
            <div className="p-2 rounded-full bg-white shadow-sm border border-gray-200 group-hover:shadow-md group-hover:border-gray-300 transition-all duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Volver</span>
          </button>
        </div>

        <SolicitudFormBase title="Solicitud de vacaciones" onSubmit={handleSubmit}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Datos del Solicitante</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fecha_solicitud" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Fecha de solicitud
                  </Label>
                  <Input 
                    id="fecha_solicitud" 
                    name="fecha_solicitud" 
                    type="date" 
                    readOnly 
                    value={fechaActual}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Nombre completo
                  </Label>
                  <Input 
                    readOnly 
                    value={perfil?.nombre || ""} 
                    className="bg-white border-gray-200 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    Departamento
                  </Label>
                  <Input 
                    readOnly 
                    value={perfil?.departamento || ""} 
                    className="bg-white border-gray-200 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Puesto
                  </Label>
                  <Input 
                    readOnly 
                    value={perfil?.puesto || ""} 
                    className="bg-white border-gray-200 cursor-not-allowed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Detalles de la Solicitud</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    Fecha de inicio
                  </Label>
                  <Input 
                    id="fecha_inicio" 
                    name="fecha_inicio" 
                    type="date" 
                    required 
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_fin" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    Fecha de fin
                  </Label>
                  <Input 
                    id="fecha_fin" 
                    name="fecha_fin" 
                    type="date" 
                    required 
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dias_solicitados" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  Días vacacionales solicitados
                </Label>
                <Input 
                  id="dias_solicitados" 
                  name="dias_solicitados" 
                  type="number" 
                  required 
                  min="1" 
                  placeholder="Ejemplo: 1"
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  Motivo
                </Label>
                <Textarea 
                  id="motivo" 
                  name="motivo" 
                  placeholder="Describa el motivo de su solicitud de vacaciones..."
                  rows={4}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Información importante</h4>
                <p className="text-sm text-amber-700">
                  Su solicitud será revisada por su jefe directo. Recibirá una notificación sobre el estatus de su solicitud en breves.
                </p>
              </div>
            </div>
          </div>
        </SolicitudFormBase>
      </div>
    </div>
  )
}
