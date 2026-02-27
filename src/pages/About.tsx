import { Trophy, Users, Calendar, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const stats = [
    { icon: Trophy, value: "50+", label: t("about.stadiums") },
    { icon: Users, value: "10k+", label: t("about.players") },
    { icon: Calendar, value: "25k+", label: t("about.bookings") },
    { icon: Star, value: "4.9", label: t("about.rating") },
  ];

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-display text-4xl font-bold uppercase mb-4">{t("about.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("about.description")}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border rounded-lg p-6 text-center">
            <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="font-display text-2xl font-bold mb-3">{t("about.mission")}</h2>
          <p className="text-muted-foreground">{t("about.missionDesc")}</p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold mb-3">{t("about.howItWorks")}</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>{t("about.step1")}</li>
            <li>{t("about.step2")}</li>
            <li>{t("about.step3")}</li>
            <li>{t("about.step4")}</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
