import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: t("contact.sent"), description: t("contact.sentDesc") });
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 500);
  };

  return (
    <div className="container py-16">
      <h1 className="font-display text-4xl font-bold uppercase text-center mb-12">{t("contact.title")}</h1>
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="space-y-6">
          <p className="text-muted-foreground">{t("contact.description")}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{t("contact.email")}</p>
                <p className="text-sm text-muted-foreground">contact@stadiumbook.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{t("contact.phone")}</p>
                <p className="text-sm text-muted-foreground">+213 555 123 456</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{t("contact.address")}</p>
                <p className="text-sm text-muted-foreground">Algiers, Algeria</p>
              </div>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-display">{t("contact.sendMessage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cname">{t("contact.name")}</Label>
                <Input id="cname" placeholder={t("contact.yourName")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">{t("contact.email")}</Label>
                <Input id="cemail" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cmsg">{t("contact.message")}</Label>
                <Textarea id="cmsg" placeholder={t("contact.howCanWeHelp")} rows={4} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("contact.sending") : t("contact.send")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
