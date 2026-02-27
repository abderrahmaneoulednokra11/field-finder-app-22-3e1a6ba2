import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "fr" | "ar";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { fr: "Accueil", ar: "الرئيسية" },
  "nav.stadiums": { fr: "Stades", ar: "الملاعب" },
  "nav.about": { fr: "À propos", ar: "حول" },
  "nav.contact": { fr: "Contact", ar: "اتصل بنا" },
  "nav.myReservations": { fr: "Mes Réservations", ar: "حجوزاتي" },
  "nav.admin": { fr: "Admin", ar: "الإدارة" },
  "nav.signIn": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "nav.signOut": { fr: "Déconnexion", ar: "تسجيل الخروج" },
  "nav.adminDashboard": { fr: "Tableau de bord", ar: "لوحة التحكم" },

  // Hero
  "hero.title1": { fr: "Réservez Votre", ar: "احجز" },
  "hero.title2": { fr: "Terrain", ar: "ملعبك" },
  "hero.subtitle": { fr: "Le moyen le plus simple de réserver des stades de football. Choisissez votre format, sélectionnez votre horaire et jouez.", ar: "أسهل طريقة لحجز ملاعب كرة القدم. اختر التنسيق، حدد الوقت والعب." },
  "hero.browse": { fr: "Voir les Stades", ar: "تصفح الملاعب" },
  "hero.getStarted": { fr: "Commencer", ar: "ابدأ الآن" },

  // Features
  "features.title": { fr: "Pourquoi", ar: "لماذا" },
  "features.multipleLocations": { fr: "Emplacements Multiples", ar: "مواقع متعددة" },
  "features.multipleLocationsDesc": { fr: "Trouvez des terrains près de chez vous", ar: "ابحث عن ملاعب بالقرب منك" },
  "features.instantBooking": { fr: "Réservation Instantanée", ar: "حجز فوري" },
  "features.instantBookingDesc": { fr: "Réservez en quelques secondes, 24h/24", ar: "احجز في ثوانٍ، على مدار الساعة" },
  "features.guaranteedSlot": { fr: "Créneau Garanti", ar: "مكان مضمون" },
  "features.guaranteedSlotDesc": { fr: "Pas de double réservation — votre terrain est sécurisé", ar: "لا حجز مزدوج — ملعبك محجوز" },
  "features.allFormats": { fr: "Tous les Formats", ar: "جميع الأشكال" },
  "features.allFormatsDesc": { fr: "5c5, 7c7, 9c9, et 11c11 disponibles", ar: "5ض5، 7ض7، 9ض9، و11ض11 متاحة" },

  // CTA
  "cta.title": { fr: "Prêt à Jouer ?", ar: "مستعد للعب؟" },
  "cta.subtitle": { fr: "Créez votre compte gratuit et commencez à réserver dès aujourd'hui.", ar: "أنشئ حسابك المجاني وابدأ الحجز اليوم." },
  "cta.signUp": { fr: "Inscrivez-vous", ar: "سجّل الآن" },

  // Stadiums page
  "stadiums.title": { fr: "Nos Stades", ar: "ملاعبنا" },
  "stadiums.subtitle": { fr: "Parcourez les terrains disponibles", ar: "تصفح الملاعب المتاحة" },
  "stadiums.allTypes": { fr: "Tous les types", ar: "جميع الأنواع" },
  "stadiums.filterType": { fr: "Filtrer par type", ar: "تصفية حسب النوع" },
  "stadiums.noStadiums": { fr: "Aucun stade trouvé.", ar: "لم يتم العثور على ملاعب." },
  "stadiums.bookNow": { fr: "Réserver", ar: "احجز الآن" },
  "stadiums.maintenance": { fr: "En maintenance", ar: "في الصيانة" },
  "stadiums.available": { fr: "Disponible", ar: "متاح" },

  // Book page
  "book.title": { fr: "Réserver", ar: "حجز" },
  "book.date": { fr: "Date", ar: "التاريخ" },
  "book.startTime": { fr: "Heure de début", ar: "وقت البداية" },
  "book.endTime": { fr: "Heure de fin", ar: "وقت النهاية" },
  "book.confirm": { fr: "Confirmer la Réservation", ar: "تأكيد الحجز" },
  "book.booking": { fr: "Réservation en cours...", ar: "جاري الحجز..." },
  "book.invalidTime": { fr: "Heure invalide", ar: "وقت غير صالح" },
  "book.invalidTimeDesc": { fr: "L'heure de fin doit être après l'heure de début", ar: "يجب أن يكون وقت النهاية بعد وقت البداية" },
  "book.confirmed": { fr: "Réservation confirmée !", ar: "تم تأكيد الحجز!" },
  "book.failed": { fr: "Échec de la réservation", ar: "فشل الحجز" },

  // My Reservations
  "myRes.title": { fr: "Mes Réservations", ar: "حجوزاتي" },
  "myRes.noReservations": { fr: "Aucune réservation pour l'instant.", ar: "لا توجد حجوزات حتى الآن." },
  "myRes.cancel": { fr: "Annuler", ar: "إلغاء" },
  "myRes.confirmed": { fr: "Confirmée", ar: "مؤكدة" },
  "myRes.cancelled": { fr: "Annulée", ar: "ملغاة" },
  "myRes.reservationCancelled": { fr: "Réservation annulée", ar: "تم إلغاء الحجز" },

  // About
  "about.title": { fr: "À propos de StadiumBook", ar: "حول StadiumBook" },
  "about.description": { fr: "StadiumBook est une plateforme moderne de réservation de stades de football qui facilite la recherche et la réservation de terrains. Que vous organisiez un match 5c5 décontracté ou un match 11c11 compétitif, nous avons le terrain parfait.", ar: "StadiumBook هي منصة حديثة لحجز ملاعب كرة القدم تسهل البحث والحجز. سواء كنت تنظم مباراة 5ض5 ودية أو مباراة 11ض11 تنافسية، لدينا الملعب المثالي." },
  "about.stadiums": { fr: "Stades", ar: "ملاعب" },
  "about.players": { fr: "Joueurs", ar: "لاعبين" },
  "about.bookings": { fr: "Réservations", ar: "حجوزات" },
  "about.rating": { fr: "Note", ar: "تقييم" },
  "about.mission": { fr: "Notre Mission", ar: "مهمتنا" },
  "about.missionDesc": { fr: "Nous croyons que tout le monde mérite d'accéder à des terrains de qualité. Notre plateforme connecte les joueurs avec les propriétaires de stades, rendant le processus de réservation fluide.", ar: "نؤمن أن الجميع يستحق الوصول إلى ملاعب ذات جودة. منصتنا تربط اللاعبين بأصحاب الملاعب، مما يجعل عملية الحجز سلسة." },
  "about.howItWorks": { fr: "Comment ça marche", ar: "كيف يعمل" },
  "about.step1": { fr: "Parcourez les stades disponibles et choisissez votre type de terrain préféré", ar: "تصفح الملاعب المتاحة واختر نوع الملعب المفضل" },
  "about.step2": { fr: "Créez un compte gratuit ou connectez-vous", ar: "أنشئ حسابًا مجانيًا أو سجّل دخولك" },
  "about.step3": { fr: "Sélectionnez la date et l'horaire", ar: "حدد التاريخ والوقت" },
  "about.step4": { fr: "Confirmez votre réservation — c'est aussi simple que ça !", ar: "أكّد حجزك — بهذه البساطة!" },

  // Contact
  "contact.title": { fr: "Contactez-nous", ar: "اتصل بنا" },
  "contact.description": { fr: "Vous avez une question ou souhaitez collaborer avec nous ? Nous serions ravis de vous entendre.", ar: "هل لديك سؤال أو ترغب في التعاون معنا؟ يسعدنا أن نسمع منك." },
  "contact.email": { fr: "Email", ar: "البريد الإلكتروني" },
  "contact.phone": { fr: "Téléphone", ar: "الهاتف" },
  "contact.address": { fr: "Adresse", ar: "العنوان" },
  "contact.sendMessage": { fr: "Envoyer un message", ar: "إرسال رسالة" },
  "contact.name": { fr: "Nom", ar: "الاسم" },
  "contact.yourName": { fr: "Votre nom", ar: "اسمك" },
  "contact.message": { fr: "Message", ar: "الرسالة" },
  "contact.howCanWeHelp": { fr: "Comment pouvons-nous vous aider ?", ar: "كيف يمكننا مساعدتك؟" },
  "contact.sending": { fr: "Envoi...", ar: "جاري الإرسال..." },
  "contact.send": { fr: "Envoyer", ar: "إرسال" },
  "contact.sent": { fr: "Message envoyé !", ar: "تم إرسال الرسالة!" },
  "contact.sentDesc": { fr: "Nous vous répondrons bientôt.", ar: "سنتواصل معك قريبًا." },

  // Auth
  "auth.welcomeBack": { fr: "Bienvenue", ar: "مرحبًا بعودتك" },
  "auth.createAccount": { fr: "Créer un compte", ar: "إنشاء حساب" },
  "auth.signInDesc": { fr: "Connectez-vous pour réserver votre terrain", ar: "سجّل الدخول لحجز ملعبك" },
  "auth.signUpDesc": { fr: "Rejoignez StadiumBook aujourd'hui", ar: "انضم إلى StadiumBook اليوم" },
  "auth.fullName": { fr: "Nom complet", ar: "الاسم الكامل" },
  "auth.email": { fr: "Email", ar: "البريد الإلكتروني" },
  "auth.password": { fr: "Mot de passe", ar: "كلمة المرور" },
  "auth.signIn": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "auth.signUp": { fr: "Créer un compte", ar: "إنشاء حساب" },
  "auth.pleaseWait": { fr: "Veuillez patienter...", ar: "يرجى الانتظار..." },
  "auth.noAccount": { fr: "Pas de compte ? Inscrivez-vous", ar: "ليس لديك حساب؟ سجّل الآن" },
  "auth.hasAccount": { fr: "Déjà un compte ? Connectez-vous", ar: "لديك حساب؟ سجّل الدخول" },

  // Footer
  "footer.description": { fr: "Réservez votre terrain de football préféré en quelques secondes. 5c5, 7c7, 9c9, ou 11c11.", ar: "احجز ملعب كرة القدم المفضل لديك في ثوانٍ. 5ض5، 7ض7، 9ض9، أو 11ض11." },
  "footer.quickLinks": { fr: "Liens Rapides", ar: "روابط سريعة" },
  "footer.browseStadiums": { fr: "Voir les Stades", ar: "تصفح الملاعب" },
  "footer.aboutUs": { fr: "À propos", ar: "حول" },
  "footer.contact": { fr: "Contact", ar: "اتصل بنا" },

  // Admin
  "admin.panel": { fr: "Panneau Admin", ar: "لوحة الإدارة" },
  "admin.dashboard": { fr: "Tableau de bord", ar: "لوحة التحكم" },
  "admin.stadiums": { fr: "Stades", ar: "الملاعب" },
  "admin.reservations": { fr: "Réservations", ar: "الحجوزات" },
  "admin.users": { fr: "Utilisateurs", ar: "المستخدمون" },
  "admin.backToSite": { fr: "Retour au site", ar: "العودة للموقع" },
  "admin.totalStadiums": { fr: "Total Stades", ar: "إجمالي الملاعب" },
  "admin.activeReservations": { fr: "Réservations Actives", ar: "الحجوزات النشطة" },
  "admin.totalUsers": { fr: "Total Utilisateurs", ar: "إجمالي المستخدمين" },
  "admin.underMaintenance": { fr: "En Maintenance", ar: "في الصيانة" },
  "admin.addStadium": { fr: "Ajouter un Stade", ar: "إضافة ملعب" },
  "admin.editStadium": { fr: "Modifier le Stade", ar: "تعديل الملعب" },
  "admin.newStadium": { fr: "Nouveau Stade", ar: "ملعب جديد" },
  "admin.name": { fr: "Nom", ar: "الاسم" },
  "admin.type": { fr: "Type", ar: "النوع" },
  "admin.status": { fr: "Statut", ar: "الحالة" },
  "admin.pricePerHour": { fr: "Prix/heure (DA)", ar: "السعر/ساعة (د.ج)" },
  "admin.location": { fr: "Emplacement", ar: "الموقع" },
  "admin.imageUrl": { fr: "URL de l'image", ar: "رابط الصورة" },
  "admin.actions": { fr: "Actions", ar: "إجراءات" },
  "admin.create": { fr: "Créer", ar: "إنشاء" },
  "admin.update": { fr: "Mettre à jour", ar: "تحديث" },
  "admin.user": { fr: "Utilisateur", ar: "المستخدم" },
  "admin.stadium": { fr: "Stade", ar: "الملعب" },
  "admin.date": { fr: "Date", ar: "التاريخ" },
  "admin.time": { fr: "Horaire", ar: "الوقت" },
  "admin.role": { fr: "Rôle", ar: "الدور" },
  "admin.joined": { fr: "Inscrit le", ar: "تاريخ الانضمام" },
  "admin.price": { fr: "Prix/h", ar: "السعر/س" },

  // Common
  "common.error": { fr: "Erreur", ar: "خطأ" },
  "common.loading": { fr: "Chargement...", ar: "جاري التحميل..." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "fr";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
