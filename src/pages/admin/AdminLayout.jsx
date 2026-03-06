import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building, Calendar, Users, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: t("admin.dashboard"), exact: true },
    { to: "/admin/stadiums", icon: Building, label: t("admin.stadiums") },
    { to: "/admin/reservations", icon: Calendar, label: t("admin.reservations") },
    { to: "/admin/users", icon: Users, label: t("admin.users") },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-sidebar border-r flex flex-col">
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-sidebar-foreground">{t("admin.panel")}</h2>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-destructive transition-colors px-3 py-2 w-full rounded-md hover:bg-sidebar-accent/50"
          >
            <LogOut className="w-4 h-4" /> {t("nav.signOut")}
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-background p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
