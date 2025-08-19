"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Mosaic } from "react-loading-indicators"

export default function RegistroUsuarioForm() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([])
  const [rolId, setRolId] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const fetchRoles = async () => {
      const { data, error } = await supabase.from("roles").select("id, nombre")
      if (error) {
        console.error("Error al cargar roles:", error.message)
      } else {
        setRoles(data || [])
      }
    }
    fetchRoles()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const nombre = formData.get("nombre") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!nombre.trim() || !email.trim() || !password.trim() || !rolId) {
      setError("Por favor, completa todos los campos.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/usuarios/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol_id: rolId }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Error desconocido")
        setIsSubmitting(false)
        return
      }

      setSuccessMessage("¡Usuario registrado con éxito!")
      setTimeout(() => router.push("/admin/users"), 2000)
    } catch (err: any) {
      setError(err.message || "Error de red")
      setIsSubmitting(false)
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000)
    }
  }

  const handleCancelar = () => router.push("/admin/users")

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40">
          <Mosaic color="#2464ec" size="large" />
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-center text-lg font-medium text-gray-800">
            Registro de usuarios
          </h1>
        </div>

        <div className="px-6 py-6">
          {successMessage && (
            <div className="mb-3 text-green-700 text-sm">{successMessage}</div>
          )}

          {error && <div className="mb-3 text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre" className="text-gray-700 text-sm mb-1 block">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 text-sm mb-1 block">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 text-sm mb-1 block">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="rol" className="text-gray-700 text-sm mb-1 block">
                Rol
              </Label>
              <select
                id="rol"
                name="rol"
                value={rolId}
                onChange={(e) => setRolId(e.target.value)}
                disabled={isSubmitting}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelar}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
