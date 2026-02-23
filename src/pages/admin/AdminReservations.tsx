import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, XCircle } from "lucide-react";

interface Reservation {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled";
  user_id: string;
  stadium: { name: string } | null;
  userName?: string;
  userEmail?: string;
}

export default function AdminReservations() {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [resResult, profilesResult] = await Promise.all([
      supabase.from("reservations").select("id, date, start_time, end_time, status, user_id, stadium:stadiums(name)").order("date", { ascending: false }),
      supabase.from("profiles").select("user_id, name, email"),
    ]);

    const profileMap = new Map((profilesResult.data || []).map((p) => [p.user_id, p]));
    const enriched = ((resResult.data as unknown as Reservation[]) || []).map((r) => {
      const profile = profileMap.get(r.user_id);
      return { ...r, userName: profile?.name || "Unknown", userEmail: profile?.email || "" };
    });

    setReservations(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from("reservations").update({ status: "cancelled" as const }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Reservation cancelled" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reservation?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Reservation deleted" });
    fetchData();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Reservations</h1>
      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Stadium</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.userName}<br /><span className="text-xs text-muted-foreground">{r.userEmail}</span></TableCell>
                  <TableCell>{r.stadium?.name || "—"}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.start_time} - {r.end_time}</TableCell>
                  <TableCell><Badge variant={r.status === "confirmed" ? "default" : "destructive"}>{r.status}</Badge></TableCell>
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
