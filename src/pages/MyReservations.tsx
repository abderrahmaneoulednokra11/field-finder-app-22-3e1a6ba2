import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface ReservationWithStadium {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled";
  stadium: { name: string; type: string; location: string | null } | null;
}

export default function MyReservations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [reservations, setReservations] = useState<ReservationWithStadium[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("reservations")
      .select("id, date, start_time, end_time, status, stadium:stadiums(name, type, location)")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    setReservations((data as unknown as ReservationWithStadium[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, [user]);

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from("reservations").update({ status: "cancelled" as const }).eq("id", id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("myRes.reservationCancelled") });
      fetchReservations();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold uppercase mb-8">{t("myRes.title")}</h1>
      {reservations.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">{t("myRes.noReservations")}</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <div key={r.id} className="bg-card border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> {r.stadium?.type || "—"}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {r.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {r.start_time} - {r.end_time}</span>
                  {r.stadium?.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {r.stadium.location}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={r.status === "confirmed" ? "default" : "destructive"}>
                  {r.status === "confirmed" ? t("myRes.confirmed") : t("myRes.cancelled")}
                </Badge>
                {r.status === "confirmed" && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel(r.id)}>{t("myRes.cancel")}</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
