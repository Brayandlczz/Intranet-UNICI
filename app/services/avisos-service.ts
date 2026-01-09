"use client"

import { supabase } from "@/utils/supabase/client";

export type Aviso = {
  id: string
  titulo: string
  descripcion: string
  fecha_publicacion: string
  archivo_url?: string
  nombre_archivo?: string
  creado_por: string
  created_at?: string
  updated_at?: string
  creador?: {
    nombre?: string
    email?: string
  }
}

export type AvisoFormData = {
  titulo: string
  descripcion: string
  fecha_publicacion: string
  archivo?: File | null
}

export const AvisosService = {
  async getAvisos(): Promise<Aviso[]> {
    try {
      const { data, error } = await supabase
        .from("avisos")
        .select(`
          *,
          creador:profiles(nombre, email)
        `)
        .order("fecha_publicacion", { ascending: false })

      if (error) {
        console.error("Error al obtener avisos:", error.message)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Error al obtener avisos:", err)
      return []
    }
  },

  async getAvisoById(id: string): Promise<Aviso | null> {
    const { data, error } = await supabase
      .from("avisos")
      .select(`
        *,
        creador:profiles(nombre, email)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error al obtener aviso:", error)
      return null
    }

    return data
  },

  async createAviso(
    formData: AvisoFormData,
    userId: string,
  ): Promise<{ success: boolean; message: string; id?: string }> {
    let archivoUrl = null
    let nombreArchivo = null

    try {
      if (formData.archivo) {
        const fileExt = formData.archivo.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `avisos/${fileName}`

        nombreArchivo = formData.archivo.name

        const { error: uploadError } = await supabase.storage.from("archivos-intra").upload(filePath, formData.archivo)

        if (uploadError) throw uploadError

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("archivos-intra")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // 10 años de duración
      
      if (signedUrlError) throw signedUrlError;
      
      archivoUrl = signedUrlData?.signedUrl;
      }
      const { data, error } = await supabase
        .from("avisos")
        .insert([
          {
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          fecha_publicacion: formData.fecha_publicacion,
          archivo_url: archivoUrl,
          nombre_archivo: nombreArchivo, 
          creado_por: userId,
        }
      ])
        .select()

      if (error) throw error

      return {
        success: true,
        message: "Aviso creado correctamente",
        id: data[0].id || null, 
      };
    } catch (error: any) {
      console.error("Error al crear aviso:", error)
      return {
        success: false,
        message: error.message || "Error al crear el aviso",
      }
    }
  },

  async updateAviso(id: string, formData: AvisoFormData): Promise<{ success: boolean; message: string }> {

    try {
      const { data: avisoActual } = await supabase
        .from("avisos")
        .select("archivo_url, nombre_archivo")
        .eq("id", id)
        .single()

      let archivoUrl = avisoActual?.archivo_url || null
      let nombreArchivo = avisoActual?.nombre_archivo || null

      if (formData.archivo) {
        const fileExt = formData.archivo.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `avisos/${fileName}`

        nombreArchivo = formData.archivo.name

        const { error: uploadError } = await supabase.storage.from("archivos-intra").upload(filePath, formData.archivo)

        if (uploadError) throw uploadError

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("archivos-intra")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); 
      
      if (signedUrlError) throw signedUrlError;
      
      archivoUrl = signedUrlData?.signedUrl;
      }      

      const { error } = await supabase
        .from("avisos")
        .update({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          fecha_publicacion: formData.fecha_publicacion,
          archivo_url: archivoUrl,
          nombre_archivo: nombreArchivo, 
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      return {
        success: true,
        message: "Aviso actualizado correctamente",
      }
    } catch (error: any) {
      console.error("Error al actualizar aviso:", error)
      return {
        success: false,
        message: error.message || "Error al actualizar el aviso",
      }
    }
  },

  async deleteAviso(id: string): Promise<{ success: boolean; message: string }> {

    try {
      const { data: aviso } = await supabase.from("avisos").select("archivo_url").eq("id", id).single()

      if (aviso?.archivo_url) {
        const urlParts = aviso.archivo_url.split("/")
        const fileName = urlParts[urlParts.length - 1]
        const filePath = `avisos/${fileName}`

        await supabase.storage.from("archivos-intra").remove([filePath])
      }

      const { error } = await supabase.from("avisos").delete().eq("id", id)

      if (error) throw error

      return {
        success: true,
        message: "Aviso eliminado correctamente",
      }
    } catch (error: any) {
      console.error("Error al eliminar aviso:", error)
      return {
        success: false,
        message: error.message || "Error al eliminar el aviso",
      }
    }
  },
}

