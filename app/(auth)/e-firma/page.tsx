"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mosaic } from "react-loading-indicators";

export default function UploadArchivo() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(true); 
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsUploading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Por favor selecciona un archivo.");
    setIsUploading(true);

    try {
      const safeName = file.name.replace(/\s+/g, "_");
      const filePath = `firmas/${Date.now()}_${safeName}`;
      const { error } = await supabase.storage
        .from("digital-sign-employees")
        .upload(filePath, file);

      if (error) {
        console.error("Error al subir archivo:", error.message);
        alert("Error al subir el archivo.");
      } else {
        alert("Archivo subido con éxito.");
        setFile(null);
        resetFileInput();
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Error inesperado al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50">
        <Mosaic color="#2464ec" size="medium" />
        <p className="mt-4 text-gray-600 text-center">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 px-4">
      <div className="w-full max-w-xl my-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Carga de Firma Electrónica
          </h2>
          <p className="mt-2 text-gray-600">
            Selecciona el archivo que contenga tu firma digital, válida y necesaria para
            realizar futuros trámites.
          </p>
        </div>

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
        >
          <Upload className="w-16 h-16 text-gray-400" />
          <p className="text-center mt-4 text-lg text-gray-600">
            {file ? file.name : "Haz clic aquí para cargar tu firma digital."}
          </p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mx-auto block"
        >
          Subir archivo
        </button>
      </div>
    </div>
  );
}
