import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStadiumMainImage } from "@/lib/stadium-images";
import type { Tables } from "@/integrations/supabase/types";
import { MapPin, DollarSign, Users } from "lucide-react";

type Stadium = Tables<"stadiums">;

export default function Stadiums() {
  const { t } = useLanguage();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("stadiums").select("*").order("name");
      if (filter !== "all") {
        query = query.eq("type", filter as Stadium["type"]);
      }
      const { data } = await query;
      setStadiums(data || []);
      setLoading(false);
    };
    fetch();
  }, [filter]);

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">{t("stadiums.title")}</h1>
          <p className="text-muted-foreground">{t("stadiums.subtitle")}</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("stadiums.filterType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("stadiums.allTypes")}</SelectItem>
            <SelectItem value="5v5">5v5</SelectItem>
            <SelectItem value="7v7">7v7</SelectItem>
            <SelectItem value="9v9">9v9</SelectItem>
            <SelectItem value="11v11">11v11</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : stadiums.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">{t("stadiums.noStadiums")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map((s) => {
            const mainImg = getStadiumMainImage(s.id);
            return (
              <div key={s.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted">
                  <img src={mainImg} alt={`${s.type} pitch`} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-lg font-semibold">{s.type}</h3>
                    <Badge variant={s.status === "available" ? "default" : "destructive"}>
                      {s.status === "available" ? t("stadiums.available") : t("stadiums.maintenance")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {s.type}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {s.price_per_hour} DA/hr</span>
                  </div>
                  {s.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4" /> {s.location}
                    </p>
                  )}
                  {s.status === "available" ? (
                    <Link to={`/book/${s.id}`}>
                      <Button className="w-full">{t("stadiums.bookNow")}</Button>
                    </Link>
                  ) : (
                    <Button className="w-full" disabled>{t("stadiums.maintenance")}</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
