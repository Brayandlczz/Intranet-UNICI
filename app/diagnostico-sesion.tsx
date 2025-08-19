"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export default function DiagnosticoSesion() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any | null>(null)
  const [cookiesData, setCookiesData] = useState<string[]>([])
  const [jwtData, setJwtData] = useState<any | null>(null)
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  const checkSessionWithGetSession = async () => {
    try {
      addLog("Verificando sesión con supabase.auth.getSession()...")
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        addLog(`❌ Error al obtener la sesión: ${error.message}`)
        return null
      }

      if (!data.session) {
        addLog("❌ No hay sesión activa según getSession()")
        return null
      }

      addLog(`✅ Sesión encontrada con getSession()`)
      addLog(`📧 Email: ${data.session.user.email}`)
      addLog(`🆔 User ID: ${data.session.user.id}`)
      addLog(`⏱️ Expira: ${new Date(data.session.expires_at! * 1000).toLocaleString()}`)

      const expiresAt = data.session.expires_at! * 1000
      const now = Date.now()
      const timeLeft = expiresAt - now

      if (timeLeft < 0) {
        addLog(`⚠️ La sesión ha expirado hace ${Math.abs(Math.round(timeLeft / 1000 / 60))} minutos`)
      } else {
        addLog(`✅ La sesión expira en ${Math.round(timeLeft / 1000 / 60)} minutos`)
      }

      return data.session
    } catch (error: any) {
      addLog(`❌ Error al verificar sesión con getSession: ${error.message}`)
      return null
    }
  }

  const checkSessionWithGetUser = async () => {
    try {
      addLog("Verificando usuario con supabase.auth.getUser()...")
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        addLog(`❌ Error al obtener el usuario: ${error.message}`)
        return null
      }

      if (!data.user) {
        addLog("❌ No hay usuario activo según getUser()")
        return null
      }

      addLog(`✅ Usuario encontrado con getUser()`)
      addLog(`📧 Email: ${data.user.email}`)
      addLog(`🆔 User ID: ${data.user.id}`)

      return data.user
    } catch (error: any) {
      addLog(`❌ Error al verificar usuario con getUser: ${error.message}`)
      return null
    }
  }

  const checkCookies = () => {
    try {
      addLog("Verificando cookies del navegador...")
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim())

      if (cookies.length === 0 || (cookies.length === 1 && cookies[0] === "")) {
        addLog("❌ No se encontraron cookies en el navegador")
        return []
      }

      const supabaseCookies = cookies.filter(
        (cookie) =>
          cookie.startsWith("sb-") ||
          cookie.includes("supabase") ||
          cookie.includes("access_token") ||
          cookie.includes("refresh_token"),
      )

      if (supabaseCookies.length === 0) {
        addLog("❌ No se encontraron cookies relacionadas con Supabase")
      } else {
        addLog(`✅ Se encontraron ${supabaseCookies.length} cookies relacionadas con Supabase`)

        const hasAccessToken = supabaseCookies.some((c) => c.includes("access_token"))
        const hasRefreshToken = supabaseCookies.some((c) => c.includes("refresh_token"))

        if (hasAccessToken) {
          addLog("✅ Cookie de access_token encontrada")
        } else {
          addLog("❌ No se encontró cookie de access_token")
        }

        if (hasRefreshToken) {
          addLog("✅ Cookie de refresh_token encontrada")
        } else {
          addLog("❌ No se encontró cookie de refresh_token")
        }
      }

      return cookies
    } catch (error: any) {
      addLog(`❌ Error al verificar cookies: ${error.message}`)
      return []
    }
  }

  const checkJWT = async () => {
    try {
      addLog("Verificando JWT...")

      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        addLog("❌ No se pudo obtener JWT (no hay sesión activa)")
        return null
      }

      const accessToken = data.session.access_token
      const decodedJWT = decodeJWT(accessToken)

      if (!decodedJWT) {
        addLog("❌ No se pudo decodificar el JWT")
        return null
      }

      addLog("✅ JWT decodificado correctamente")

      if (decodedJWT.exp) {
        const expiresAt = decodedJWT.exp * 1000
        const now = Date.now()
        const timeLeft = expiresAt - now

        if (timeLeft < 0) {
          addLog(`⚠️ El JWT ha expirado hace ${Math.abs(Math.round(timeLeft / 1000 / 60))} minutos`)
        } else {
          addLog(`✅ El JWT expira en ${Math.round(timeLeft / 1000 / 60)} minutos`)
        }
      }

      if (decodedJWT.sub) {
        addLog(`✅ El JWT contiene el ID de usuario (sub): ${decodedJWT.sub}`)
      } else {
        addLog("❌ El JWT no contiene ID de usuario (sub)")
      }

      if (decodedJWT.role) {
        addLog(`✅ El JWT contiene el rol: ${decodedJWT.role}`)
      }

      return decodedJWT
    } catch (error: any) {
      addLog(`❌ Error al verificar JWT: ${error.message}`)
      return null
    }
  }

  const testSupabaseAPI = async () => {
    try {
      addLog("Probando conexión a la API de Supabase...")

      const { data, error } = await supabase.from("profiles").select("count()").limit(1)

      if (error) {
        addLog(`❌ Error al conectar con la API de Supabase: ${error.message}`)

        if (error.code === "401" || error.message.includes("JWT")) {
          addLog("⚠️ Error de autenticación. Posible problema con el token JWT.")
        }

        return false
      }

      addLog("✅ Conexión exitosa a la API de Supabase")
      return true
    } catch (error: any) {
      addLog(`❌ Error al probar la API de Supabase: ${error.message}`)
      return false
    }
  }

  const runAllDiagnostics = async () => {
    try {
      setIsLoading(true)
      setLogs([])
      addLog("Iniciando diagnóstico completo de sesión...")

      const session = await checkSessionWithGetSession()
      setSessionData(session)

      await checkSessionWithGetUser()

      const cookies = checkCookies()
      setCookiesData(cookies)

      const jwt = await checkJWT()
      setJwtData(jwt)

      await testSupabaseAPI()

      addLog("Diagnóstico completo finalizado.")
    } catch (error: any) {
      addLog(`❌ Error general en el diagnóstico: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runAllDiagnostics()
  }, [])

  const handleRenewSession = async () => {
    try {
      addLog("Intentando renovar la sesión...")

      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        addLog(`❌ Error al renovar la sesión: ${error.message}`)
        return
      }

      if (!data.session) {
        addLog("❌ No se pudo renovar la sesión (no hay datos de sesión)")
        return
      }

      addLog("✅ Sesión renovada correctamente")
      setSessionData(data.session)

      setTimeout(() => {
        runAllDiagnostics()
      }, 1000)
    } catch (error: any) {
      addLog(`❌ Error al renovar la sesión: ${error.message}`)
    }
  }

  const handleTestLogin = async () => {
    try {
      addLog("Iniciando sesión de prueba...")

      const email = prompt("Ingresa tu email:")
      if (!email) {
        addLog("❌ Inicio de sesión cancelado (no se proporcionó email)")
        return
      }

      const password = prompt("Ingresa tu contraseña:")
      if (!password) {
        addLog("❌ Inicio de sesión cancelado (no se proporcionó contraseña)")
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        addLog(`❌ Error al iniciar sesión: ${error.message}`)
        return
      }

      if (!data.session) {
        addLog("❌ No se pudo iniciar sesión (no hay datos de sesión)")
        return
      }

      addLog("✅ Sesión iniciada correctamente")
      setSessionData(data.session)

      setTimeout(() => {
        runAllDiagnostics()
      }, 1000)
    } catch (error: any) {
      addLog(`❌ Error al iniciar sesión: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      addLog("Cerrando sesión...")

      const { error } = await supabase.auth.signOut()

      if (error) {
        addLog(`❌ Error al cerrar sesión: ${error.message}`)
        return
      }

      addLog("✅ Sesión cerrada correctamente")
      setSessionData(null)

      setTimeout(() => {
        runAllDiagnostics()
      }, 1000)
    } catch (error: any) {
      addLog(`❌ Error al cerrar sesión: ${error.message}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Sesión</h1>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
          <p>Ejecutando diagnóstico de sesión...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Resultado del diagnóstico</h2>

            <div className="mb-4">
              <p className="font-medium">Estado de la sesión:</p>
              <p className={sessionData ? "text-green-600" : "text-red-600"}>
                {sessionData ? "✅ Sesión activa" : "❌ No hay sesión activa"}
              </p>
              {sessionData && (
                <div className="text-sm text-gray-600 mt-1">
                  <p>Usuario: {sessionData.user.email}</p>
                  <p>ID: {sessionData.user.id}</p>
                  <p>Expira: {new Date(sessionData.expires_at * 1000).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="font-medium">Estado de las cookies:</p>
              <p className={cookiesData.length > 0 ? "text-green-600" : "text-red-600"}>
                {cookiesData.length > 0
                  ? `✅ ${cookiesData.length} cookies encontradas`
                  : "❌ No se encontraron cookies"}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium">Estado del JWT:</p>
              <p className={jwtData ? "text-green-600" : "text-red-600"}>
                {jwtData ? "✅ JWT válido" : "❌ JWT no válido o no encontrado"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={runAllDiagnostics}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Ejecutar diagnóstico nuevamente
              </button>

              <button
                onClick={handleRenewSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!sessionData}
              >
                Renovar sesión
              </button>

              <button
                onClick={handleTestLogin}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={!!sessionData}
              >
                Iniciar sesión de prueba
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={!sessionData}
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {jwtData && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Datos del JWT</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">{JSON.stringify(jwtData, null, 2)}</pre>
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

