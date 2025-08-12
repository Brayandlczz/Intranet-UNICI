"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import BirthdayMessage from "@/utils/birthdayMessage"

interface Announcement {
  id: number
  titulo: string
  fecha_publicacion: string
}

interface BirthdayProfile {
  id: string
  nombre: string
  fecha_nacimiento: string
}

export default function DashboardPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [birthdays, setBirthdays] = useState<BirthdayProfile[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        console.error("Error al obtener usuario", error)
      } else {
        setUserId(user?.id ?? null)
      }
    }

    fetchUser()
    fetchRecentAnnouncements()
    fetchBirthdaysThisMonth()
  }, [])

  async function fetchRecentAnnouncements() {
    const { data, error } = await supabase
      .from("avisos")
      .select("id, titulo, fecha_publicacion")
      .order("fecha_publicacion", { ascending: false })
      .limit(3)

    if (!error && data) setAnnouncements(data)
    else console.error("Error al obtener avisos:", error)
  }

  async function fetchBirthdaysThisMonth() {
    const now = new Date()
    const currentMonth = now.getMonth()

    const { data, error } = await supabase
      .from("profiles")
      .select("id, nombre, fecha_nacimiento")
      .eq("estado", "Activo")

    if (error) {
      console.error("Error al obtener cumpleañeros:", error)
      return
    }

    if (!data) {
      console.error("No se recibieron datos de Supabase.")
      return
    }

    const filtered = data.filter((profile) => {
      const birthDate = new Date(profile.fecha_nacimiento)
      return birthDate.getMonth() === currentMonth
    })

    const sorted = filtered.sort(
      (a, b) =>
        new Date(a.fecha_nacimiento).getDate() -
        new Date(b.fecha_nacimiento).getDate()
    )

    setBirthdays(sorted)
  }

  const handleViewMore = (id: number) => {
    router.push(`/avisos/`)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 overflow-x-hidden pb-10">
      <p className="text-center">
        Bienvenido a la red interna UNICI. Selecciona una opción del menú lateral para comenzar a navegar entre apartados.
      </p>

      {userId && <BirthdayMessage userId={userId} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2 text-center">Avisos recientes</h2>
          {announcements.length === 0 ? (
            <p className="text-gray-500 text-center">No hay avisos disponibles</p>
          ) : (
            <ul className="space-y-2">
              {announcements.map((a) => (
                <li key={a.id} className="border-b pb-2">
                  <p className="font-medium text-left break-words">{a.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(a.fecha_publicacion + "T00:00:00"), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                  <div className="mt-1 text-right">
                    <button
                      onClick={() => handleViewMore(a.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver más
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2 text-center">Cumpleañeros del mes</h2>
          {birthdays.length === 0 ? (
            <p className="text-gray-600 text-center">No hay cumpleañeros este mes</p>
          ) : (
            <ul className="space-y-3">
              {birthdays.map((b) => (
                <li key={b.id} className="border-b pb-2">
                  <p className="font-medium text-center">{b.nombre}</p>
                  <p className="text-sm text-gray-500 text-center">
                    {format(new Date(b.fecha_nacimiento + "T00:00:00"), "d 'de' MMMM", {
                      locale: es,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2 text-center">Solicitudes pendientes</h2>
          <p className="text-gray-600 text-center">No hay solicitudes pendientes</p>
        </div>
      </div>
    </div>
  )
}
