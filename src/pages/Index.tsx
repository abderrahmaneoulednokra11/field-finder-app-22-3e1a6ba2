import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-stadium.jpg";

const features = [
  { icon: MapPin, title: "Multiple Locations", desc: "Find pitches near you across the city" },
  { icon: Clock, title: "Instant Booking", desc: "Reserve your slot in seconds, 24/7" },
  { icon: Shield, title: "Guaranteed Slot", desc: "No double bookings — your pitch is secured" },
  { icon: Users, title: "All Formats", desc: "5v5, 7v7, 9v9, and 11v11 available" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Football stadium at night" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-4 uppercase tracking-tight">
            Book Your <span className="text-accent">Pitch</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
            The easiest way to reserve football stadiums. Pick your format, choose your time, and play.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/stadiums">
              <Button size="lg" className="font-display uppercase tracking-wider">
                Browse Stadiums
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="font-display uppercase tracking-wider border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 uppercase">
          Why <span className="text-primary">StadiumBook</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-card border rounded-lg p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 uppercase">Ready to Play?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Create your free account and start booking stadiums today.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="font-display uppercase tracking-wider">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
