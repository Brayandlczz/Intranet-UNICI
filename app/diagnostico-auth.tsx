"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export default function DiagnosticoAuth() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const runDiagnostic = async () => {
    try {
      setIsLoading(true)
      setLogs([])
      addLog("Iniciando diagnóstico de autenticación...")

      addLog("Verificando sesión de usuario...")
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        addLog(`❌ Error al obtener la sesión: ${sessionError.message}`)
        throw sessionError
      }

      if (!sessionData.session) {
        addLog("❌ No hay sesión activa. El usuario no está autenticado.")
        setUserId(null)
        return
      }

      const currentUser = sessionData.session.user
      setUserId(currentUser.id)
      addLog(`✅ Sesión activa encontrada para el usuario: ${currentUser.id}`)
      addLog(`📧 Email del usuario: ${currentUser.email}`)

      addLog(`Buscando perfil para el usuario ${currentUser.id}...`)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single()

      if (profileError) {
        if (profileError.code === "PGRST116") {
          addLog("❌ No se encontró un perfil para este usuario en la tabla profiles.")
        } else {
          addLog(`❌ Error al buscar el perfil: ${profileError.message}`)
        }

        addLog("Verificando políticas RLS en la tabla profiles...")
        const { data: rlsTestData, error: rlsTestError } = await supabase.from("profiles").select("count()").limit(1)

        if (rlsTestError) {
          addLog(`❌ Error de permisos RLS: ${rlsTestError.message}`)
          addLog("Es posible que las políticas RLS estén bloqueando el acceso a la tabla profiles.")
        } else {
          addLog("✅ Las políticas RLS permiten leer la tabla profiles.")
        }

        addLog("Verificando si existen otros perfiles en la tabla...")
        const { data: allProfiles, error: allProfilesError } = await supabase.from("profiles").select("id").limit(5)

        if (allProfilesError) {
          addLog(`❌ Error al verificar otros perfiles: ${allProfilesError.message}`)
        } else if (allProfiles.length === 0) {
          addLog("❌ La tabla profiles está vacía. No hay perfiles creados.")
        } else {
          addLog(`✅ Se encontraron ${allProfiles.length} perfiles en la tabla.`)
          addLog(`IDs de ejemplo: ${allProfiles.map((p) => p.id).join(", ")}`)
        }
      } else {
        addLog("✅ Perfil encontrado correctamente!")
        setProfileData(profileData)
        addLog(`Nombre: ${profileData.nombre || "No especificado"}`)
        addLog(`Email: ${profileData.email || "No especificado"}`)
        addLog(`Departamento: ${profileData.departamento || "No especificado"}`)
      }
    } catch (error: any) {
      console.error("Error en diagnóstico:", error)
      setError(error.message)
      addLog(`❌ Error general: ${error.message}`)
    } finally {
      setIsLoading(false)
      addLog("Diagnóstico completado.")
    }
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  const handleCreateProfile = async () => {
    if (!userId) {
      addLog("❌ No hay usuario autenticado para crear un perfil.")
      return
    }

    try {
      addLog(`Intentando crear perfil para usuario: ${userId}...`)

      const newProfile = {
        id: userId,
        nombre: "Usuario",
        email: "usuario@ejemplo.com",
        departamento: "Tecnología",
        puesto: "Desarrollador",
        fecha_ingreso: new Date().toISOString().split("T")[0],
        estado: "Activo",
      }

      const { data, error } = await supabase.from("profiles").upsert(newProfile).select()

      if (error) {
        addLog(`❌ Error al crear perfil: ${error.message}`)
        throw error
      }

      addLog("✅ Perfil creado exitosamente!")
      setProfileData(newProfile)

      setTimeout(() => {
        runDiagnostic()
      }, 1000)
    } catch (error: any) {
      addLog(`❌ Error al crear perfil: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      addLog("Cerrando sesión...")
      await supabase.auth.signOut()
      addLog("✅ Sesión cerrada correctamente")
      setUserId(null)
      setProfileData(null)

      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
    } catch (error: any) {
      addLog(`❌ Error al cerrar sesión: ${error.message}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Autenticación</h1>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
          <p>Ejecutando diagnóstico...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Resultado del diagnóstico</h2>

            <div className="mb-4">
              <p className="font-medium">Estado de autenticación:</p>
              <p className={userId ? "text-green-600" : "text-red-600"}>
                {userId ? "✅ Usuario autenticado" : "❌ Usuario no autenticado"}
              </p>
              {userId && <p className="text-sm text-gray-600">ID: {userId}</p>}
            </div>

            <div className="mb-4">
              <p className="font-medium">Estado del perfil:</p>
              <p className={profileData ? "text-green-600" : "text-red-600"}>
                {profileData ? "✅ Perfil encontrado" : "❌ Perfil no encontrado"}
              </p>
            </div>

            {!profileData && userId && (
              <button
                onClick={handleCreateProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
              >
                Crear perfil para este usuario
              </button>
            )}

            <button
              onClick={runDiagnostic}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mr-2"
            >
              Ejecutar diagnóstico nuevamente
            </button>

            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Cerrar sesión
            </button>
          </div>

          {profileData && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Datos del perfil</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Registro de diagnóstico:</h3>
            <div className="max-h-96 overflow-y-auto bg-gray-900 text-gray-100 p-4 rounded-md">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-sm mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

