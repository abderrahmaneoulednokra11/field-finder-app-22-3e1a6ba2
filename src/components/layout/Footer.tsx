import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold text-primary mb-2">⚽ StadiumBook</h3>
            <p className="text-sm text-muted-foreground">
              Book your favorite football pitch in seconds. 5v5, 7v7, 9v9, or 11v11 — we've got you covered.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/stadiums" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Stadiums</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-3">Contact</h4>
            <p className="text-sm text-muted-foreground">contact@stadiumbook.com</p>
            <p className="text-sm text-muted-foreground">+213 555 123 456</p>
          </div>
        </div>
        <div className="border-t mt-6 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StadiumBook — PFE Project
        </div>
      </div>
    </footer>
  );
}
