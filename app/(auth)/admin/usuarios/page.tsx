"use client"

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select(`id, nombre, email, created_at, updated_at`)
        .order("nombre", { ascending: true });

      if (error) {
        console.error("Error fetching users:", error);
      } else if (data) {
        const formattedUsers = data.map((u: any) => ({
          id: u.id,
          name: u.nombre,
          email: u.email,
          status: "Activo", // puedes ajustar según tu lógica
        }));
        setUsers(formattedUsers);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestión de Usuarios</h2>
        <Button
          className="bg-blue-600 text-white"
          onClick={() => router.push("/admin/usuarios/registro")}
        >
          + Agregar usuario
        </Button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Buscar usuarios..."
            className="max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-auto">
          <table className="w-full table-auto border-b text-center">
            <thead>
              <tr>
                <th className="text-nowrap py-2">Nombre de usuario</th>
                <th className="text-nowrap">Correo electrónico</th>
                <th className="text-nowrap">Estatus</th>
                <th className="text-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-2">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm mx-auto inline-block">
                      {user.status}
                    </span>
                  </td>
                  <td className="flex justify-center gap-2">
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementView;
