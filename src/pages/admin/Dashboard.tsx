import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, Users, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ stadiums: 0, reservations: 0, users: 0, maintenance: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [stadiums, reservations, users, maintenance] = await Promise.all([
        supabase.from("stadiums").select("id", { count: "exact", head: true }),
        supabase.from("reservations").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("stadiums").select("id", { count: "exact", head: true }).eq("status", "maintenance"),
      ]);
      setStats({
        stadiums: stadiums.count || 0,
        reservations: reservations.count || 0,
        users: users.count || 0,
        maintenance: maintenance.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: t("admin.totalStadiums"), value: stats.stadiums, icon: Building, color: "text-primary" },
    { title: t("admin.activeReservations"), value: stats.reservations, icon: Calendar, color: "text-accent" },
    { title: t("admin.totalUsers"), value: stats.users, icon: Users, color: "text-pitch" },
    { title: t("admin.underMaintenance"), value: stats.maintenance, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">{t("admin.dashboard")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
