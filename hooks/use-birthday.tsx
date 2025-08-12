import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function useBirthday() {
  const [isBirthday, setIsBirthday] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkBirthday() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) return

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("fecha_nacimiento")
        .eq("id", user.id)
        .single()
      if (profileError) return

      if (profile?.fecha_nacimiento) {
        const today = new Date()
        const birthDate = new Date(profile.fecha_nacimiento + "T00:00:00")
        if (today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()) {
          setIsBirthday(true)
        }
      }
    }
    checkBirthday()
  }, [supabase])

  return isBirthday
}
