"use client"

import { useEffect, useRef, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { gsap } from "gsap"
import Confetti from "react-confetti"
import { useWindowSize } from "@/utils/birthday-fetti"

interface BirthdayMessageProps {
  userId: string
  message?: string
  charsPerTick?: number
  ticksPerChar?: number
}

export default function BirthdayMessage({
  userId,
  message = "¡La comunidad UNICI te desea un Feliz cumpleaños! Que tengas un día espectacular.",
  charsPerTick = 1,
  ticksPerChar = 3,
}: BirthdayMessageProps) {
  const supabase = createClientComponentClient()
  const birthdayTextRef = useRef<HTMLParagraphElement>(null)
  const { width, height } = useWindowSize()

  const [isBirthday, setIsBirthday] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiVisible, setConfettiVisible] = useState(true)

  useEffect(() => {
    async function checkBirthday() {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("fecha_nacimiento")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error obteniendo perfil", error)
        return
      }

      if (profile?.fecha_nacimiento) {
        const today = new Date()
        const birthDate = new Date(profile.fecha_nacimiento + "T00:00:00")

        const sameDay = today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()
        setIsBirthday(sameDay)
      }
    }
    checkBirthday()
  }, [userId, supabase])

  useEffect(() => {
    if (isBirthday) {
      setShowConfetti(true)
      setConfettiVisible(true)

      const fadeOutTimer = setTimeout(() => setConfettiVisible(false), 10000)
      const hideTimer = setTimeout(() => setShowConfetti(false), 12000)

      return () => {
        clearTimeout(fadeOutTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [isBirthday])

  useEffect(() => {
    if (!birthdayTextRef.current) return
    if (!isBirthday) return

    const el = birthdayTextRef.current
    el.textContent = ""

    let currentIndex = 0
    let tickCount = 0

    function type() {
      tickCount++
      if (tickCount >= ticksPerChar) {
        tickCount = 0
        for (let i = 0; i < charsPerTick; i++) {
          if (currentIndex < message.length) {
            el.textContent += message[currentIndex]
            currentIndex++
          } else {
            gsap.ticker.remove(type)
            break
          }
        }
      }
    }

    gsap.ticker.add(type)
    return () => {
      gsap.ticker.remove(type)
    }
  }, [message, charsPerTick, ticksPerChar, isBirthday])

  if (!isBirthday) return null

  return (
    <>
<div
  className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 ${
    confettiVisible ? "opacity-100 pointer-events-none" : "opacity-0 pointer-events-none"
  }`}
  aria-hidden={!confettiVisible}
  style={{ margin: 0, padding: 0 }}
>
  {showConfetti && <Confetti width={width} height={height} numberOfPieces={400} recycle={true} />}
</div>


      <p
        ref={birthdayTextRef}
        className="font-bold select-none text-center text-xl md:text-2xl lg:text-3xl break-words"
        style={{
          color: "#e3b50eff",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        }}
      />
    </>
  )
}
