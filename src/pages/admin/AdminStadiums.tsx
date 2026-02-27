import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Stadium = Tables<"stadiums">;

export default function AdminStadiums() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Stadium | null>(null);
  const [form, setForm] = useState({ name: "", type: "5v5" as Stadium["type"], price_per_hour: 0, status: "available" as Stadium["status"], location: "", description: "", image_url: "" });

  const fetchStadiums = async () => {
    const { data } = await supabase.from("stadiums").select("*").order("created_at", { ascending: false });
    setStadiums(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchStadiums(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", type: "5v5", price_per_hour: 0, status: "available", location: "", description: "", image_url: "" });
    setDialogOpen(true);
  };

  const openEdit = (s: Stadium) => {
    setEditing(s);
    setForm({ name: s.name, type: s.type, price_per_hour: s.price_per_hour, status: s.status, location: s.location || "", description: s.description || "", image_url: s.image_url || "" });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price_per_hour: Number(form.price_per_hour), image_url: form.image_url || null, location: form.location || null, description: form.description || null };

    if (editing) {
      const { error } = await supabase.from("stadiums").update(payload).eq("id", editing.id);
      if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); return; }
      toast({ title: t("admin.update") });
    } else {
      const { error } = await supabase.from("stadiums").insert(payload);
      if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); return; }
      toast({ title: t("admin.create") });
    }
    setDialogOpen(false);
    fetchStadiums();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stadium?")) return;
    const { error } = await supabase.from("stadiums").delete().eq("id", id);
    if (error) { toast({ title: t("common.error"), description: error.message, variant: "destructive" }); return; }
    fetchStadiums();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">{t("admin.stadiums")}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> {t("admin.addStadium")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? t("admin.editStadium") : t("admin.newStadium")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("admin.name")}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("admin.type")}</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Stadium["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5v5">5v5</SelectItem>
                      <SelectItem value="7v7">7v7</SelectItem>
                      <SelectItem value="9v9">9v9</SelectItem>
                      <SelectItem value="11v11">11v11</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("admin.status")}</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Stadium["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">{t("stadiums.available")}</SelectItem>
                      <SelectItem value="maintenance">{t("stadiums.maintenance")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("admin.pricePerHour")}</Label>
                <Input type="number" value={form.price_per_hour} onChange={(e) => setForm({ ...form, price_per_hour: Number(e.target.value) })} required min={0} />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.location")}</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.imageUrl")}</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">{editing ? t("admin.update") : t("admin.create")}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.name")}</TableHead>
                <TableHead>{t("admin.type")}</TableHead>
                <TableHead>{t("admin.price")}</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
                <TableHead className="text-right">{t("admin.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stadiums.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.type}</TableCell>
                  <TableCell>{s.price_per_hour} DA</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "available" ? "default" : "destructive"}>
                      {s.status === "available" ? t("stadiums.available") : t("stadiums.maintenance")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
