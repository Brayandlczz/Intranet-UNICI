import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const useSolicitudesListener = (empleadoId: string | null) => {
  const [notifications, setNotifications] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!empleadoId) return;

    const fetchNotifications = async () => {
      const { count, error } = await supabase
        .from("orquestador_solicitudes")
        .select("id", { count: "exact" })
        .eq("empleado_id", empleadoId)
        .eq("estado", "pendiente");

      if (!error) setNotifications(count ?? 0);
    };

    fetchNotifications();

    const channel = supabase
      .channel("solicitudes-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orquestador_solicitudes" },
        (payload: any) => {
          if (payload.new?.empleado_id === empleadoId && payload.new?.estado === "pendiente") {
            setNotifications((prev) => prev + 1);
          }

          if (payload.old?.empleado_id === empleadoId && payload.old?.estado === "pendiente") {
            setNotifications((prev) => Math.max(prev - 1, 0));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [empleadoId, supabase]);

  return notifications;
};
