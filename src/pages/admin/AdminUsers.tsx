import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  role?: string;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (!profiles) { setLoading(false); return; }

    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const roleMap = new Map((roles || []).map((r) => [r.user_id, r.role]));

    setUsers(profiles.map((p) => ({ ...p, role: roleMap.get(p.user_id) || "client" })));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); return; }
    fetchData();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">{t("admin.users")}</h1>
      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.name")}</TableHead>
                <TableHead>{t("auth.email")}</TableHead>
                <TableHead>{t("admin.role")}</TableHead>
                <TableHead>{t("admin.joined")}</TableHead>
                <TableHead className="text-right">{t("admin.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge></TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(u.user_id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
