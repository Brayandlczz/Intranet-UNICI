"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Mosaic } from "react-loading-indicators"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { FileText, ExternalLink } from "lucide-react"
import type { Aviso } from "@/app/services/avisos-service"

export default function AvisosPageClient() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function cargarAvisos() {
      try {
        const { data, error } = await supabase
          .from("avisos")
          .select(`*, creador:profiles(nombre)`)
          .order("fecha_publicacion", { ascending: false })

        if (error) throw error
        setAvisos(data || [])
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarAvisos()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-lg font-semibold">Cargando avisos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        Error al cargar los avisos: {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Avisos y Comunicados</h1>

      {avisos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">No hay avisos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {avisos.map((aviso) => (
            <div key={aviso.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{aviso.titulo}</h2>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>
                    Publicado el{" "}
                    {aviso.fecha_publicacion
                      ? format(
                          new Date(aviso.fecha_publicacion + "T00:00:00"),
                          "d 'de' MMMM 'de' yyyy",
                          { locale: es }
                        )
                      : "Fecha no disponible"}
                  </span>
                  {aviso.creador && <span className="ml-2">por {aviso.creador.nombre}</span>}
                </div>

                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 whitespace-pre-line">{aviso.descripcion}</p>
                </div>

                {aviso.archivo_url && (
                  <div className="mt-4">
                    <a
                      href={aviso.archivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Ver documento adjunto
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-3 text-right">
                <p className="text-xs text-gray-500">
                  Publicado:{" "}
                  {format(new Date(aviso.created_at || aviso.fecha_publicacion), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
