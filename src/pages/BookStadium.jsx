import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Clock, MapPin, Users, CalendarDays, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
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

function isSlotTooSoon(date, slotStart) {
  const now = new Date();
  const [h, m] = slotStart.split(":").map(Number);
  const slotDate = new Date(date + "T00:00:00");
  slotDate.setHours(h, m, 0, 0);
  const diffMs = slotDate.getTime() - now.getTime();
  return diffMs < 2 * 60 * 60 * 1000; // less than 2 hours
}

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
        .in("status", ["pending", "approved", "confirmed"]);

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

  const handleSelectSlot = (i) => {
    const slot = TIME_SLOTS[i];
    if (reservedSlots.has(slot.start)) {
      toast({ title: t("book.alreadyTaken"), variant: "destructive" });
      return;
    }
    if (isSlotTooSoon(date, slot.start)) {
      toast({ title: t("book.tooSoon"), variant: "destructive" });
      return;
    }
    setSelectedSlot(i);
  };

  const handleSubmit = async () => {
    if (!user || !stadium || selectedSlot === null) return;
    const slot = TIME_SLOTS[selectedSlot];

    // Client-side re-check
    if (isSlotTooSoon(date, slot.start)) {
      toast({ title: t("book.tooSoon"), variant: "destructive" });
      return;
    }

    setLoading(true);

    // Verify slot is still free in DB
    const { data: existing } = await supabase
      .from("reservations")
      .select("id")
      .eq("stadium_id", stadium.id)
      .eq("date", date)
      .eq("start_time", slot.start)
      .in("status", ["pending", "approved", "confirmed"])
      .maybeSingle();

    if (existing) {
      toast({ title: t("book.alreadyTaken"), variant: "destructive" });
      setReservedSlots((prev) => new Set([...prev, slot.start]));
      setSelectedSlot(null);
      setLoading(false);
      return;
    }

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
      toast({ title: t("book.pendingMessage") });
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
    <div className="container py-8 md:py-12 max-w-4xl">
      {/* Hero image gallery */}
      <div className="mb-8">
        <div className="rounded-2xl overflow-hidden aspect-[16/9] shadow-lg">
          <img
            src={images[activeImg]}
            alt={`${stadium.type} pitch`}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`rounded-xl overflow-hidden w-28 h-20 border-2 transition-all duration-200 ${
                activeImg === i
                  ? "border-primary shadow-lg ring-2 ring-primary/30 scale-105"
                  : "border-border opacity-60 hover:opacity-100 hover:border-primary/40"
              }`}
            >
              <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Stadium info bar */}
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3">
          {t("book.title")} — {stadium.type}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
            <Users className="w-4 h-4" /> {stadium.type}
          </span>
          <span className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full font-medium">
            <Clock className="w-4 h-4" /> {stadium.price_per_hour} MAD / 1h30
          </span>
          {stadium.location && (
            <span className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full font-medium">
              <MapPin className="w-4 h-4" /> {stadium.location}
            </span>
          )}
        </div>
      </div>

      {/* Booking form */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Date picker section */}
        <div className="p-5 md:p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-5 h-5 text-primary" />
            <Label htmlFor="date" className="text-base font-semibold text-foreground">{t("book.date")}</Label>
          </div>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
            className="max-w-xs text-base"
          />
        </div>

        {/* Slots section */}
        {date && (
          <div className="p-5 md:p-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold text-foreground">{t("book.selectSlot")}</Label>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-5 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {t("book.available")}
              </span>
              <span className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-destructive" /> {t("book.reserved")}
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-accent" /> {t("book.tooSoonShort")}
              </span>
            </div>

            {loadingSlots ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot, i) => {
                  const isReserved = reservedSlots.has(slot.start);
                  const tooSoon = isSlotTooSoon(date, slot.start);
                  const isDisabled = isReserved || tooSoon;
                  const isSelected = selectedSlot === i;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectSlot(i)}
                      className={`
                        group relative rounded-xl p-4 text-center font-medium transition-all duration-200 border-2
                        ${isReserved
                          ? "border-destructive/20 bg-destructive/5 text-muted-foreground cursor-not-allowed"
                          : tooSoon
                            ? "border-accent/20 bg-accent/5 text-muted-foreground cursor-not-allowed"
                            : isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                              : "border-border bg-card text-foreground hover:border-primary hover:shadow-md hover:scale-[1.01] cursor-pointer"
                        }
                      `}
                    >
                      <div className="text-base font-bold tracking-wide">
                        {slot.start} → {slot.end}
                      </div>
                      <div className="text-xs mt-1.5 flex items-center justify-center gap-1">
                        {isReserved ? (
                          <><XCircle className="w-3 h-3" /> {t("book.reserved")}</>
                        ) : tooSoon ? (
                          <><AlertTriangle className="w-3 h-3" /> {t("book.tooSoonShort")}</>
                        ) : isSelected ? (
                          <><CheckCircle2 className="w-3 h-3" /> ✓</>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3 text-primary" /> {t("book.available")}</>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="p-5 md:p-6">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            disabled={loading || selectedSlot === null || !date}
          >
            {loading ? t("book.booking") : t("book.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
