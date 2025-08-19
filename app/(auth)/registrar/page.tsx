"use client"

import React, { useState } from "react"

const RegistrarPage = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
    setSuccess("")
    setStatus("idle")
  }

  const handleSubmit = async () => {
    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden.")
      setStatus("idle")
      return
    }
    setStatus("loading")
    setTimeout(() => {
      setSuccess("¡Registro exitoso!")
      setStatus("success")
      setForm({
        nombre: "",
        email: "",
        password: "",
        confirmarPassword: "",
      })
    }, 1800)
  }

  const renderAnimation = () => {
    if (status === "loading") {
      return (
        <svg className="animate-spin-slow" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" stroke="#3b82f6" strokeWidth="4" fill="none" opacity="0.2"/>
          <path d="M36 20a16 16 0 0 1-16 16" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
      )
    }
    if (status === "success") {
      return (
        <svg className="animate-success-bounce" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" stroke="#22c55e" strokeWidth="4" fill="none" opacity="0.2"/>
          <polyline points="12,21 18,27 28,15" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
    return (
      <svg className="animate-hand-write" width="40" height="32" viewBox="0 0 40 32">
        <rect x="6" y="26" width="28" height="5" rx="2.5" fill="#e0e7ef"/>
        <path d="M12 25 Q17 21 22 25 Q27 29 32 25" stroke="#3b82f6" strokeWidth="2" fill="none"/>
        <circle className="hand" cx="22" cy="25" r="3" fill="#3b82f6"/>
      </svg>
    )
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-6 backdrop-blur-md border border-blue-100 animate-slide-up mx-4">
        <div className="flex flex-col items-center mb-4">
          <div className="mb-2">{renderAnimation()}</div>
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight animate-fade-in-slow">
            Registro
          </h2>
          <p className="text-gray-500 text-sm text-center animate-fade-in-slow">
            Crea tu cuenta UNICI
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="group relative">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 text-sm rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all bg-white/70 shadow-sm"
              placeholder="Ej. Juan Pérez"
            />
          </div>
          
          <div className="group relative">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 text-sm rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all bg-white/70 shadow-sm"
              placeholder="correo@ejemplo.com"
            />
          </div>
          
          <div className="group relative">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 text-sm rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all bg-white/70 shadow-sm"
              placeholder="********"
            />
          </div>
          
          <div className="group relative">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmarPassword"
              value={form.confirmarPassword}
              onChange={handleChange}
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 text-sm rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all bg-white/70 shadow-sm"
              placeholder="********"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-xs text-center animate-shake py-1">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-600 text-xs text-center animate-bounce-in py-1">
              {success}
            </div>
          )}
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className={`w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 animate-pop text-sm ${
              status === "loading"
                ? "opacity-60 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-xl"
            }`}
          >
            {status === "loading" ? "Registrando..." : "Registrarse"}
          </button>
        </div>
      </div>
      
      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        .animate-fade-in-slow {
          animation: fadeIn 1.5s ease;
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(.4,2,.6,1);
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(.4,2,.6,1);
        }
        .animate-shake {
          animation: shake 0.4s;
        }
        .animate-bounce-in {
          animation: bounceIn 0.7s;
        }
        .animate-spin-slow {
          animation: spin 1.2s linear infinite;
          transform-origin: 50% 50%;
        }
        .animate-success-bounce {
          animation: bounceIn 0.7s;
        }
        .animate-hand-write .hand {
          animation: handWrite 1.2s infinite alternate;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0 }
          80% { transform: scale(1.05); opacity: 1 }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.7); opacity: 0 }
          60% { transform: scale(1.1); opacity: 1 }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes handWrite {
          0% { transform: translateX(0); }
          50% { transform: translateX(8px) scale(1.1); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export default RegistrarPage