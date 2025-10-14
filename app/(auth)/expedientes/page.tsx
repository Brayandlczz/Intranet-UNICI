"use client";

import { useState } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Star, 
  Award,
  Clock,
  Building2,
  User,
  Globe,
} from "lucide-react";
 
interface Experiencia {
  puesto: string;
  empresa: string;
  anios: number;
  descripcion: string;
  tecnologias: string[];
}

interface Habilidad {
  nombre: string;
  nivel: string;
  categoria: string;
}

interface Educacion {
  titulo: string;
  institucion: string;
  anio: number;
  estado: string;
}

interface Certificacion {
  nombre: string;
  emisor: string;
  fecha: string;
  estado: string;
}

export default function HistorialTrabajador() {
  const [experiencia] = useState<Experiencia[]>([
    { 
      puesto: "Desarrolladora de Aplicaciones Móviles", 
      empresa: "JFX Studio", 
      anios: 3,
      descripcion: "Desarrollo de aplicaciones móviles utilizando Flutter y Firebase como gestor BDD.",
      tecnologias: ["Flutter", "FlutterFlow", "Firebase", "MongoDB", "NoSQL"]
    },
    { 
      puesto: "Encargada de Área TI - Actualidad", 
      empresa: "Universidad Internacional del Conocimiento e Investigación", 
      anios: 2,
      descripcion: "Implementación y mantenimiento de tecnologías de uso diario de ámbito académico",
      tecnologias: ["CRM's", "Redes CISCO", "Mantenimiento Correctivo/Preventivo", "Desarrollo en general"]
    },
  ]);

  const [habilidades] = useState<Habilidad[]>([
    { nombre: "React", nivel: "Avanzado", categoria: "Frontend" },
    { nombre: "Node.js", nivel: "Avanzado", categoria: "Backend" },
    { nombre: "TypeScript", nivel: "Intermedio", categoria: "Lenguajes" },
    { nombre: "PostgreSQL", nivel: "Avanzado", categoria: "Bases de Datos" },
    { nombre: "Docker", nivel: "Intermedio", categoria: "DevOps" },
    { nombre: "Git", nivel: "Avanzado", categoria: "Herramientas" },
  ]);

  const [educacion] = useState<Educacion[]>([
    { titulo: "Licenciatura en Sistemas Computacionales", institucion: "Universidad Autónoma de Chiapas", anio: 2015, estado: "Completado" },
    { titulo: "Certificación en Desarrollo Web", institucion: "Platzi", anio: 2021, estado: "Completado" },
  ]);

  const [certificaciones] = useState<Certificacion[]>([
    { nombre: "Introducción a las Redes", emisor: "Cisco Packet Tracer", fecha: "2014", estado: "Vigente" },
    { nombre: "Desarrollo web Inteligente", emisor: "StackOverFlow", fecha: "2024", estado: "Vigente" },
  ]);

  return (
    <div className="min-h-screen sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="relative">
              <img
                src="https://xitctcgkzkmbtskavbyt.supabase.co/storage/v1/object/sign/archivos-intra/0fa6b78b-6fe5-4403-9933-fe5791dd769d/gabishka.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iOWEyMjBlYi03ODFlLTRkMzUtODJmNi05ZTc3MjdkNTYxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmNoaXZvcy1pbnRyYS8wZmE2Yjc4Yi02ZmU1LTQ0MDMtOTkzMy1mZTU3OTFkZDc2OWQvZ2FiaXNoa2EuanBnIiwiaWF0IjoxNzU2NDA2MTMzLCJleHAiOjE3ODc5NDIxMzN9.0Cq7EAFFVQpNYIRSjmoB_qLTTJskPaWC8q5NfZR_8Uo"
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Gabriela Stefania Ozuna Camas
              </h1>
              <p className="text-xl text-blue-600 font-semibold mb-3">
                Licenciada en Sistemas Computacionales
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Tuxtla Gutiérrez, Chiapas, México</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>5 años de experiencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Líder por excelencia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">gabriela.ozuna@email.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">+52 55 1234 5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">linkedin.com/in/gabriela-ozuna</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Certificaciones</h3>
              </div>
              
              <div className="space-y-3">
                {certificaciones.map((cert, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm text-gray-900">{cert.nombre}</div>
                    <div className="text-xs text-gray-600">{cert.emisor}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{cert.fecha}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cert.estado === 'Vigente' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cert.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Experiencia Laboral</h2>
              </div>
              
              {experiencia.length > 0 ? (
                <div className="space-y-4">
                  {experiencia.map((exp, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{exp.puesto}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span>{exp.empresa}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{exp.anios} años</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3">{exp.descripcion}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {exp.tecnologias.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic text-center py-8">
                  Sin experiencia registrada
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Último Grado de Estudios</h2>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{educacion[0].titulo}</h4>
                    <p className="text-sm text-gray-600">{educacion[0].institucion}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{educacion[0].anio}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      educacion[0].estado === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {educacion[0].estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Habilidades Técnicas</h2>
              </div>
              
              {habilidades.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {habilidades.map((hab, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{hab.nombre}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hab.nivel === 'Avanzado' 
                          ? 'bg-green-100 text-green-800' 
                          : hab.nivel === 'Intermedio'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {hab.nivel}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic text-center py-8">
                  Sin habilidades registradas
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}