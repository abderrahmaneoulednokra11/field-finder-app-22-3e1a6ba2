import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold text-primary mb-2">⚽ EasyTrain</h3>
            <p className="text-sm text-muted-foreground">{t("footer.description")}</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-3">{t("footer.quickLinks")}</h4>
            <div className="space-y-2">
              <Link to="/stadiums" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.browseStadiums")}</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.aboutUs")}</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-3">{t("contact.title")}</h4>
            <p className="text-sm text-muted-foreground">contact@easytrain.ma</p>
            <p className="text-sm text-muted-foreground">+212 6 12 34 56 78</p>
          </div>
        </div>
        <div className="border-t mt-6 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EasyTrain — PFE Project
        </div>
      </div>
    </footer>
  );
}
