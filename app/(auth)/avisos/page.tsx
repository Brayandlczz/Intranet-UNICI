"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/client" 
import { Mosaic } from "react-loading-indicators"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { FileText, ExternalLink, Bell, Calendar, User, AlertCircle, Eye } from "lucide-react"
import type { Aviso } from "@/app/services/avisos-service"

export default function AvisosPageClient() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-lg font-semibold text-center">Cargando avisos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Error</h2>
          </div>
          <p className="text-gray-600 text-sm">Error al cargar los avisos: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-xl">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Avisos y Comunicados | INTRANET</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Mantente informado de los últimos avisos y comunicados institucionales</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-500">Total de avisos:</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{avisos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {avisos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center">
              <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No hay avisos disponibles</h3>
              <p className="text-gray-500 max-w-md text-sm sm:text-base">
                En este momento no hay avisos o comunicados para mostrar. 
                Revisa más tarde para estar al día con las últimas noticias.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {avisos.map((aviso, index) => (
              <div 
                key={aviso.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {aviso.titulo}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>
                            {aviso.fecha_publicacion
                              ? format(
                                  new Date(aviso.fecha_publicacion + "T00:00:00"),
                                  "d 'de' MMMM 'de' yyyy",
                                  { locale: es }
                                )
                              : "Fecha no disponible"}
                          </span>
                        </div>
                        {aviso.creador && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Publicador: {aviso.creador.nombre}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Aviso #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="prose max-w-none mb-4 sm:mb-6">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                      {aviso.descripcion}
                    </p>
                  </div>

                  {aviso.archivo_url && (
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">Documento adjunto</p>
                            <p className="text-xs text-gray-500">Haz clic para visualizar</p>
                          </div>
                        </div>
                        <a
                          href={aviso.archivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Visualizar
                          <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end text-xs text-gray-500">
                    <span>
                      Creado: {format(new Date(aviso.created_at || aviso.fecha_publicacion), "dd/MM/yyyy 'a las' HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
