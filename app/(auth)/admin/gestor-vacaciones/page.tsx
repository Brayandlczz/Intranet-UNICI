import React from "react";
import { 
  Calendar, Users, Clock, Plus, Search, Edit, CheckCircle, XCircle, Eye, TrendingUp, Filter, Download, RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Employee = {
  name: string;
  period: number;
  available: number;
  used: number;
};

type VacationRequest = {
  name: string;
  from: string;
  to: string;
  days: number;
  status: "Pendiente" | "Aprobado";
};
  
const VacationAdmin: React.FC = () => {
  const employees: Employee[] = [
    { name: "Gabriela Ozuna", period: 2025, available: 15, used: 5 },
    { name: "Fabiola Perez", period: 2025, available: 20, used: 8 },
    { name: "Martha González", period: 2025, available: 25, used: 10 },
  ];

  const requests: VacationRequest[] = [
    {
      name: "Gabriela Ozuna",
      from: "9/3/2025",
      to: "13/3/2025",
      days: 5,
      status: "Pendiente",
    },
    {
      name: "Fabiola Perez",
      from: "4/4/2025",
      to: "8/4/2025",
      days: 5,
      status: "Aprobado",
    },
  ];

  const totalEmployees = employees.length;
  const pendingRequests = requests.filter(r => r.status === "Pendiente").length;
  const totalVacationDays = employees.reduce((sum, emp) => sum + emp.available, 0);

  return (
    <div className="max-h-screen  from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestor de Vacaciones</h1>
              <p className="text-gray-600">Administra las solicitudes y saldos de vacaciones del personal</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Empleados</p>
                  <p className="text-3xl font-bold">{totalEmployees}</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Solicitudes Pendientes</p>
                  <p className="text-3xl font-bold">{pendingRequests}</p>
                </div>
                <Clock className="h-12 w-12 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Días Totales</p>
                  <p className="text-3xl font-bold">{totalVacationDays}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Saldos de Vacaciones</CardTitle>
                    <p className="text-sm text-gray-500">Control de días disponibles por empleado</p>
                  </div>
                </div>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Asignar Días
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar empleado..."
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empleado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Periodo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disponibles
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilizados
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {employee.period}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-green-600">{employee.available}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-600">{employee.used}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Solicitudes de Vacaciones</CardTitle>
                    <p className="text-sm text-gray-500">Gestiona las solicitudes pendientes</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empleado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Periodo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Días
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((request, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-amber-600">
                                  {request.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{request.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">{request.from}</div>
                              <div className="text-gray-500">hasta {request.to}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="bg-gray-100 text-gray-700">
                              {request.days} días
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge 
                              className={
                                request.status === "Pendiente" 
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }
                            >
                              {request.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {request.status === "Pendiente" ? (
                              <div className="flex gap-2">
                                <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="h-3 w-3" />
                                Detalles
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VacationAdmin;
