import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Building, Calendar, Users, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/stadiums", icon: Building, label: "Stadiums" },
  { to: "/admin/reservations", icon: Calendar, label: "Reservations" },
  { to: "/admin/users", icon: Users, label: "Users" },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="font-display text-lg font-bold text-sidebar-foreground">Admin Panel</h2>
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
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors px-3 py-2">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-background p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
