import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/stadiums", label: "Stadiums" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-primary">
          ⚽ StadiumBook
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
          {user && (
            <Link to="/my-reservations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              My Reservations
            </Link>
          )}
          {role === "admin" && (
            <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <LayoutDashboard className="inline w-4 h-4 mr-1" />
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="w-4 h-4" />
                {user.email?.split("@")[0]}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" /> Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
          {user && (
            <Link to="/my-reservations" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground">
              My Reservations
            </Link>
          )}
          {role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block text-sm font-medium text-primary">
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <Button variant="outline" size="sm" className="w-full" onClick={() => { handleSignOut(); setOpen(false); }}>
              Sign Out
            </Button>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
