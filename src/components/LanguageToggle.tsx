import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
      className="font-semibold text-xs px-2"
    >
      {lang === "fr" ? "عربي" : "FR"}
    </Button>
  );
}
