import { Trophy, Users, Calendar, Star } from "lucide-react";

const stats = [
  { icon: Trophy, value: "50+", label: "Stadiums" },
  { icon: Users, value: "10k+", label: "Players" },
  { icon: Calendar, value: "25k+", label: "Bookings" },
  { icon: Star, value: "4.9", label: "Rating" },
];

export default function About() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-display text-4xl font-bold uppercase mb-4">About StadiumBook</h1>
        <p className="text-lg text-muted-foreground">
          StadiumBook is a modern football stadium reservation platform that makes it easy to find and book pitches for your games. 
          Whether you're organizing a casual 5v5 match or a competitive 11v11 game, we've got the perfect pitch waiting for you.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border rounded-lg p-6 text-center">
            <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="font-display text-2xl font-bold mb-3">Our Mission</h2>
          <p className="text-muted-foreground">
            We believe everyone deserves access to quality football pitches. Our platform connects players with stadium owners, 
            making the booking process seamless and preventing scheduling conflicts.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold mb-3">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Browse available stadiums and pick your preferred pitch type</li>
            <li>Create a free account or sign in</li>
            <li>Select your date and time slot</li>
            <li>Confirm your booking — it's that simple!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
