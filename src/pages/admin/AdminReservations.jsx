import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";

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

  const handleUpdateStatus = async (id, status) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: status === "approved" ? t("admin.approved") : status === "rejected" ? t("admin.rejected") : t("myRes.reservationCancelled") });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this reservation?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); return; }
    fetchData();
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: t("admin.pending"), className: "bg-orange-500 text-white border-orange-500" },
      approved: { label: t("admin.approved"), className: "bg-green-600 text-white border-green-600" },
      confirmed: { label: t("myRes.confirmed"), className: "" },
      rejected: { label: t("admin.rejected"), className: "bg-destructive text-destructive-foreground" },
      cancelled: { label: t("myRes.cancelled"), className: "bg-destructive text-destructive-foreground" },
    };
    const c = config[status] || config.cancelled;
    return <Badge className={c.className}>{c.label}</Badge>;
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
                  <TableCell>{getStatusBadge(r.status)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.status === "pending" && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleUpdateStatus(r.id, "approved")}>
                          <CheckCircle2 className="w-4 h-4 mr-1" /> {t("admin.approve")}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleUpdateStatus(r.id, "rejected")}>
                          <XCircle className="w-4 h-4 mr-1" /> {t("admin.reject")}
                        </Button>
                      </>
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
