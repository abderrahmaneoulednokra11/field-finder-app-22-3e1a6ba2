import { useLanguage } from "@/contexts/LanguageContext";

const langOptions = [
  { value: "fr", label: "FR" },
  { value: "ar", label: "عربي" },
  { value: "en", label: "EN" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center bg-muted rounded-md overflow-hidden text-xs font-semibold">
      {langOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLang(opt.value)}
          className={`px-2 py-1.5 transition-colors ${
            lang === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
