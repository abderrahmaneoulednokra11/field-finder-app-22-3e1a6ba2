import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/integrations/supabase/types";
import { MapPin, DollarSign } from "lucide-react";

type Stadium = Tables<"stadiums">;

export default function Stadiums() {
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
          <h1 className="font-display text-3xl font-bold uppercase">Our Stadiums</h1>
          <p className="text-muted-foreground">Browse available football pitches</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
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
        <p className="text-center text-muted-foreground py-20">No stadiums found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map((s) => (
            <div key={s.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-muted flex items-center justify-center">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">⚽</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                  <Badge variant={s.status === "available" ? "default" : "destructive"}>
                    {s.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {s.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> {s.price_per_hour} DA/hr
                  </span>
                </div>
                {s.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                    <MapPin className="w-4 h-4" /> {s.location}
                  </p>
                )}
                {s.status === "available" ? (
                  <Link to={`/book/${s.id}`}>
                    <Button className="w-full">Book Now</Button>
                  </Link>
                ) : (
                  <Button className="w-full" disabled>Under Maintenance</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
