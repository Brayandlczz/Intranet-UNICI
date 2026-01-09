"use client"

import { supabase } from "@/utils/supabase/client" 

export type Documento = {
  id: string
  titulo: string
  descripcion: string
  tipo: 'general' | 'personal'
  archivo_url?: string
  nombre_archivo?: string
  creado_por: string
  created_at?: string
  updated_at?: string
  creador?: {
    nombre?: string
    email?: string
  }
  empleados?: {
    id: string
    nombre?: string
    email?: string
  }[]
}

export type DocumentoFormData = {
  titulo: string
  descripcion: string
  tipo: 'general' | 'personal'
  empleados_ids?: string[] 
  archivo?: File | null
}

export const DocumentosService = {
  async getDocumentos(): Promise<Documento[]> {
    try {
      const { data, error } = await supabase
        .from("documentos")
        .select(`
          *,
          creador:profiles(nombre, email)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al obtener documentos:", error.message)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Error al obtener documentos:", err)
      return []
    }
  },

  async getDocumentosGenerales(): Promise<Documento[]> {
    try {
      const { data, error } = await supabase
        .from("documentos")
        .select(`
          *,
          creador:profiles(nombre, email)
        `)
        .eq("tipo", "general")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al obtener documentos generales:", error.message)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Error al obtener documentos generales:", err)
      return []
    }
  },

  async getDocumentosPersonales(): Promise<Documento[]> {
    try {
      const { data, error } = await supabase
        .from("documentos")
        .select(`
          *,
          creador:profiles(nombre, email),
          empleados:documentos_empleados(empleado:profiles(id, nombre, email))
        `)
        .eq("tipo", "personal")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al obtener documentos personales:", error.message)
        return []
      }

      const documentosFormateados = data.map(doc => {
        const empleados = doc.empleados?.map(e => ({
          id: e.empleado.id,
          nombre: e.empleado.nombre,
          email: e.empleado.email
        })) || []

        return {
          ...doc,
          empleados
        }
      })

      return documentosFormateados || []
    } catch (err) {
      console.error("Error al obtener documentos personales:", err)
      return []
    }
  },

  async getDocumentosParaEmpleado(empleadoId: string): Promise<Documento[]> {
    try {
      const { data: documentosGenerales, error: errorGenerales } = await supabase
        .from("documentos")
        .select(`
          *,
          creador:profiles(nombre, email)
        `)
        .eq("tipo", "general")
        .order("created_at", { ascending: false });

      if (errorGenerales) {
        console.error("Error al obtener documentos generales:", errorGenerales.message)
        return [];
      }
      const { data: documentosPersonalesIds, error: errorPersonalesIds } = await supabase
        .from("documentos_empleados")
        .select("documento_id")
        .eq("empleado_id", empleadoId);

      if (errorPersonalesIds) {
        console.error("Error al obtener IDs de documentos personales:", errorPersonalesIds.message);
        return documentosGenerales || [];
      }

      const documentoIds = documentosPersonalesIds.map((doc) => doc.documento_id);

      const { data: documentosPersonales, error: errorPersonales } = await supabase
        .from("documentos")
        .select(`
          *,
          creador:profiles(nombre, email)
        `)
        .eq("tipo", "personal")
        .in("id", documentoIds)
        .order("created_at", { ascending: false });

      if (errorPersonales) {
        console.error("Error al obtener documentos personales:", errorPersonales.message)
        return documentosGenerales || [];
      }

      return [...(documentosGenerales || []), ...(documentosPersonales || [])];
    } catch (err) {
      console.error("Error al obtener documentos para empleado:", err)
      return [];
    }
  },

  async getDocumentoById(id: string): Promise<Documento | null> {
    try {
      const { data, error } = await supabase
        .from("documentos")
        .select(`
          *,
          creador:profiles(nombre, email)
        `)
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error al obtener documento:", error)
        return null
      }

      if (data.tipo === 'personal') {
        const { data: empleadosData, error: empleadosError } = await supabase
        .from("documentos_empleados")
        .select(`
          empleado:profiles(id, nombre, email)
        `)
        .eq("documento_id", id);      

        console.log(empleadosData);

        if (!empleadosError && empleadosData) {
          data.empleados = empleadosData.map(e => ({
            id: e.empleado.id,   
            nombre: e.empleado.nombre,
            email: e.empleado.email,
          }))
        }        
      }

      return data
    } catch (err) {
      console.error("Error al obtener documento:", err)
      return null
    }
  },

  async createDocumento(
    formData: DocumentoFormData,
    userId: string,
  ): Promise<{ success: boolean; message: string; id?: string }> {
    let archivoUrl = null
    let nombreArchivo = null

    try {
      if (formData.archivo) {
        const fileExt = formData.archivo.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `documentos/${fileName}`

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
        .from("documentos")
        .insert([
            {
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          tipo: formData.tipo,
          archivo_url: archivoUrl,
          nombre_archivo: nombreArchivo,
          creado_por: userId,
        }
    ])
        .select()

      if (error) throw error

      const documentoId = data[0].id

      if (formData.tipo === 'personal' && formData.empleados_ids && formData.empleados_ids.length > 0) {
        const asignaciones = formData.empleados_ids.map(empleadoId => ({
          documento_id: documentoId,
          empleado_id: empleadoId
        }))

        const { error: asignacionError } = await supabase
          .from("documentos_empleados")
          .insert(asignaciones)

        if (asignacionError) throw asignacionError
      }

      return {
        success: true,
        message: "Documento creado correctamente",
        id: documentoId,
      }
    } catch (error: any) {
      console.error("Error al crear documento:", error)
      return {
        success: false,
        message: error.message || "Error al crear el documento",
      }
    }
  },

  async updateDocumento(id: string, formData: DocumentoFormData): Promise<{ success: boolean; message: string }> {

    try {
      const { data: documentoActual } = await supabase
        .from("documentos")
        .select("archivo_url, nombre_archivo")
        .eq("id", id)
        .single()

      let archivoUrl = documentoActual?.archivo_url || null
      let nombreArchivo = documentoActual?.nombre_archivo || null

      if (formData.archivo) {
        const fileExt = formData.archivo.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `documentos/${fileName}`
      
        nombreArchivo = formData.archivo.name
      
        const { error: uploadError } = await supabase.storage
          .from("archivos-intra")
          .upload(filePath, formData.archivo)
      
        if (uploadError) throw uploadError
      
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("archivos-intra")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // 10 años de duración
      
        if (signedUrlError) throw signedUrlError
      
        archivoUrl = signedUrlData?.signedUrl
      }

      const { error } = await supabase
        .from("documentos")
        .update({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          tipo: formData.tipo,
          archivo_url: archivoUrl,
          nombre_archivo: nombreArchivo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      if (formData.tipo === 'personal') {
        const { error: deleteError } = await supabase
          .from("documentos_empleados")
          .delete()
          .eq("documento_id", id)

        if (deleteError) throw deleteError

        if (formData.empleados_ids && formData.empleados_ids.length > 0) {
          const asignaciones = formData.empleados_ids.map(empleadoId => ({
            documento_id: id,
            empleado_id: empleadoId
          }))

          const { error: asignacionError } = await supabase
            .from("documentos_empleados")
            .insert(asignaciones)

          if (asignacionError) throw asignacionError
        }
      }

      return {
        success: true,
        message: "Documento actualizado correctamente",
      }
    } catch (error: any) {
      console.error("Error al actualizar documento:", error)
      return {
        success: false,
        message: error.message || "Error al actualizar el documento",
      }
    }
  },

  async deleteDocumento(id: string): Promise<{ success: boolean; message: string }> {

    try {
      const { data: documento } = await supabase.from("documentos").select("archivo_url").eq("id", id).single()

      if (documento?.archivo_url) {
        const urlParts = documento.archivo_url.split("/")
        const fileName = urlParts[urlParts.length - 1]
        const filePath = `documentos/${fileName}`

        await supabase.storage.from("archivos-intra").remove([filePath])
      }

      await supabase.from("documentos_empleados").delete().eq("documento_id", id)

      const { error } = await supabase.from("documentos").delete().eq("id", id)

      if (error) throw error

      return {
        success: true,
        message: "Documento eliminado correctamente",
      }
    } catch (error: any) {
      console.error("Error al eliminar documento:", error)
      return {
        success: false,
        message: error.message || "Error al eliminar el documento",
      }
    }
  },

  async buscarDocumentos(termino: string): Promise<Documento[]> {
    try {
      const { data, error } = await supabase
        .from("documentos")
        .select(`
          *,
          creador:profiles(nombre, email)
        `)
        .or(`titulo.ilike.%${termino}%,descripcion.ilike.%${termino}%`)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al buscar documentos:", error.message)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Error al buscar documentos:", err)
      return []
    }
  }
}