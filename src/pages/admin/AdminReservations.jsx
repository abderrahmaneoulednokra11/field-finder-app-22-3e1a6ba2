import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, XCircle } from "lucide-react";

export default function AdminReservations() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [resResult, profilesResult] = await Promise.all([
      supabase.from("reservations").select("id, date, start_time, end_time, status, user_id, stadium:stadiums(name, type)").order("date", { ascending: false }),
      supabase.from("profiles").select("user_id, name, email"),
    ]);

    const profileMap = new Map((profilesResult.data || []).map((p) => [p.user_id, p]));
    const enriched = (resResult.data || []).map((r) => {
      const profile = profileMap.get(r.user_id);
      return { ...r, userName: profile?.name || "Unknown", userEmail: profile?.email || "" };
    });

    setReservations(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id) => {
    const { error } = await supabase.from("reservations").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); return; }
    toast({ title: t("myRes.reservationCancelled") });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this reservation?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); return; }
    fetchData();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">{t("admin.reservations")}</h1>
      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.user")}</TableHead>
                <TableHead>{t("admin.type")}</TableHead>
                <TableHead>{t("admin.date")}</TableHead>
                <TableHead>{t("admin.time")}</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
                <TableHead className="text-right">{t("admin.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.userName}<br /><span className="text-xs text-muted-foreground">{r.userEmail}</span></TableCell>
                  <TableCell>{r.stadium?.type || "—"}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.start_time} - {r.end_time}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "confirmed" ? "default" : "destructive"}>
                      {r.status === "confirmed" ? t("myRes.confirmed") : t("myRes.cancelled")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "confirmed" && (
                      <Button variant="ghost" size="sm" onClick={() => handleCancel(r.id)}><XCircle className="w-4 h-4" /></Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
