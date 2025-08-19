"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push("/dashboard")
    }
    checkSession()
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setError("¡Inicio de sesión exitoso! Redirigiendo...")
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row transition-all duration-300">
        
        <div className="bg-blue-700 text-white p-10 md:w-1/2 flex flex-col justify-center items-center">
          <img src="/logo-blanco.png" alt="Logo UNICI" className="w-36 h-auto mb-6 drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold mb-3 text-center tracking-wide">PORTAL UNICI</h1>
          <p className="text-blue-100 text-lg text-center leading-relaxed">
            Gestión integral de Recursos Humanos y comunicación interna.
          </p>
        </div>

        <div className="p-10 md:w-1/2 flex flex-col justify-center bg-white">
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-2">Intranet UNICI</h2>
          <p className="text-center text-gray-600 mb-6">Accede con tus credenciales institucionales</p>

          {error && (
            <div
              className={`mb-4 p-4 rounded-md text-sm font-medium transition ${
                error.includes("exitoso")
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Correo institucional</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="usuario@unici.edu.mx"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Olvidaste tu contraseña? <span className="text-blue-600 font-medium">Contacta al administrador</span>.
          </div>
        </div>
      </div>
    </div>
  )
}