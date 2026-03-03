import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, MapPin, Users } from "lucide-react";
import { getStadiumImages } from "@/lib/stadium-images";

const TIME_SLOTS = [
  { start: "09:00", end: "10:30" },
  { start: "10:30", end: "12:00" },
  { start: "12:00", end: "13:30" },
  { start: "13:30", end: "15:00" },
  { start: "15:00", end: "16:30" },
  { start: "16:30", end: "18:00" },
  { start: "18:00", end: "19:30" },
  { start: "19:30", end: "21:00" },
  { start: "21:00", end: "22:30" },
];

export default function BookStadium() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stadium, setStadium] = useState(null);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservedSlots, setReservedSlots] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const images = id ? getStadiumImages(id) : [];

  useEffect(() => {
    if (!id) return;
    supabase.from("stadiums").select("*").eq("id", id).single().then(({ data }) => {
      setStadium(data);
    });
  }, [id]);

  useEffect(() => {
    if (!id || !date) {
      setReservedSlots(new Set());
      setSelectedSlot(null);
      return;
    }
    const fetchReserved = async () => {
      setLoadingSlots(true);
      const { data } = await supabase
        .from("reservations")
        .select("start_time")
        .eq("stadium_id", id)
        .eq("date", date)
        .eq("status", "confirmed");

      const reserved = new Set();
      data?.forEach((r) => {
        reserved.add(r.start_time.substring(0, 5));
      });
      setReservedSlots(reserved);
      setSelectedSlot(null);
      setLoadingSlots(false);
    };
    fetchReserved();
  }, [id, date]);

  const handleSubmit = async () => {
    if (!user || !stadium || selectedSlot === null) return;
    const slot = TIME_SLOTS[selectedSlot];

    setLoading(true);
    const { error } = await supabase.from("reservations").insert({
      user_id: user.id,
      stadium_id: stadium.id,
      date,
      start_time: slot.start,
      end_time: slot.end,
    });

    if (error) {
      toast({ title: t("book.failed"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("book.confirmed"), description: `${stadium.type} - ${date} ${slot.start}→${slot.end}` });
      navigate("/my-reservations");
    }
    setLoading(false);
  };

  if (!stadium) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl">
      {/* Image Gallery */}
      <div className="mb-6">
        <div className="rounded-xl overflow-hidden aspect-video mb-3">
          <img src={images[activeImg]} alt={`${stadium.type} pitch`} className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`rounded-lg overflow-hidden w-24 h-16 border-2 transition-all ${activeImg === i ? "border-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">{t("book.title")} — {stadium.type}</CardTitle>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {stadium.type}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {stadium.price_per_hour} MAD / 1h30</span>
            {stadium.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {stadium.location}</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">{t("book.date")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {date && (
            <div className="space-y-3">
              <Label>{t("book.selectSlot")}</Label>
              {loadingSlots ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot, i) => {
                    const isReserved = reservedSlots.has(slot.start);
                    const isSelected = selectedSlot === i;

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isReserved}
                        onClick={() => setSelectedSlot(i)}
                        className={`
                          rounded-lg border-2 p-3 text-center text-sm font-medium transition-all
                          ${isReserved
                            ? "border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                            : isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-md"
                              : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                          }
                        `}
                      >
                        <div className="font-semibold">{slot.start} → {slot.end}</div>
                        <div className="text-xs mt-1">
                          {isReserved ? t("book.reserved") : t("book.available")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading || selectedSlot === null || !date}
          >
            {loading ? t("book.booking") : t("book.confirm")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
