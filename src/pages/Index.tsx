import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-stadium.jpg";

export default function Index() {
  const { t } = useLanguage();

  const features = [
    { icon: MapPin, title: t("features.multipleLocations"), desc: t("features.multipleLocationsDesc") },
    { icon: Clock, title: t("features.instantBooking"), desc: t("features.instantBookingDesc") },
    { icon: Shield, title: t("features.guaranteedSlot"), desc: t("features.guaranteedSlotDesc") },
    { icon: Users, title: t("features.allFormats"), desc: t("features.allFormatsDesc") },
  ];

  return (
    <div>
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Football stadium at night" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-4 uppercase tracking-tight">
            {t("hero.title1")} <span className="text-accent">{t("hero.title2")}</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">{t("hero.subtitle")}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/stadiums">
              <Button size="lg" className="font-display uppercase tracking-wider">{t("hero.browse")}</Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="font-display uppercase tracking-wider border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                {t("hero.getStarted")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 uppercase">
          {t("features.title")} <span className="text-primary">StadiumBook</span> ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="bg-card border rounded-lg p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 uppercase">{t("cta.title")}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">{t("cta.subtitle")}</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="font-display uppercase tracking-wider">{t("cta.signUp")}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
