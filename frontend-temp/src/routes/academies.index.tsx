import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/api/axios";

export const Route = createFileRoute("/academies/")({
  head: () => ({
    meta: [
      { title: "Sports Academies — Sportzzbook" },
      {
        name: "description",
        content: "Browse cricket, football, athletics and basketball academies with ratings, coaches and trials.",
      },
      { property: "og:title", content: "Sports Academies — Sportzzbook" },
      { property: "og:description", content: "Academies with ratings, coaches and open trials." },
    ],
  }),
  component: Academies,
});

const SPORT_ICON: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Athletics: "🏃",
  Basketball: "🏀",
};

function Academies() {
  const [academies, setAcademies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState<string>("All");

  useEffect(() => {
    async function fetchAcademies() {
      try {
        const res = await api.get("/academies");
        setAcademies(res.data);
      } catch (err) {
        console.error("Failed to load academies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAcademies();
  }, []);

  const sports = ["All", ...Array.from(new Set(academies.map((a) => a.sport)))];
  const filtered = sport === "All" ? academies : academies.filter((a) => a.sport === sport);

  const totalCoaches = academies.reduce((sum, a) => sum + (a.coaches || 0), 0);
  const totalStudents = academies.reduce((sum, a) => sum + (a.students || 0), 0);
  const featured = [...academies].sort((a, b) => b.rating - a.rating)[0];
  const rest = filtered.filter((a) => a._id !== featured?._id);

  if (loading) {
    return <p className="panel p-6 text-center text-sm text-muted-foreground">Loading academies…</p>;
  }

  return (
    <>
      <p className="eyebrow">Academies</p>
      <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Sports academies</h1>

      <section className="panel mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 px-6 py-5">
          <div className="flex flex-wrap gap-2.5">
            <Stat value={String(academies.length)} label="Academies" />
            <Stat value={String(totalCoaches)} label="Coaches" tone="accent" />
            <Stat value={String(totalStudents)} label="Students" tone="primary" />
          </div>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {sports.map((s) => (
          <button
            key={s}
            onClick={() => setSport(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              sport === s
                ? "bg-accent font-semibold text-accent-foreground"
                : "bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground"
            }`}
          >
            {SPORT_ICON[s] ? `${SPORT_ICON[s]} ${s}` : s}
          </button>
        ))}
      </div>

      {featured && sport === "All" ? (
        <article className="panel mt-5 overflow-hidden transition-transform hover:-translate-y-1">
          <div className="flex flex-wrap items-center gap-4 p-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-accent text-3xl">
              {SPORT_ICON[featured.sport] || featured.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="eyebrow">Top rated</p>
              </div>
              <h2 className="truncate font-display text-xl font-bold">{featured.name}</h2>
              <p className="truncate text-sm text-muted-foreground">
                {featured.sport} · 📍 {featured.city} · ★ {featured.rating}
              </p>
            </div>
            <Link
              to="/academies/$academyId"
              params={{ academyId: featured._id }}
              className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View academy
            </Link>
          </div>
          <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">{featured.about}</p>
        </article>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <article key={a._id} className="panel p-5 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-accent text-xl">
                {SPORT_ICON[a.sport] || a.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-base font-bold">{a.name}</h2>
                <p className="truncate text-xs text-muted-foreground">
                  {a.sport} · 📍 {a.city}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-muted-foreground">★ {a.rating}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{a.about}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {a.coaches} coaches · {a.students} students
              </p>
              <Link
                to="/academies/$academyId"
                params={{ academyId: a._id }}
                className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                View academy
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="panel mt-4 p-6 text-center text-sm text-muted-foreground">
          No academies for that sport yet.
        </p>
      ) : null}
    </>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: "accent" | "primary" }) {
  const color = tone === "accent" ? "text-accent" : tone === "primary" ? "text-primary" : "text-foreground";
  return (
    <div className="min-w-[104px] rounded-xl bg-background/60 px-4 py-3 ring-1 ring-border">
      <p className={`font-display text-2xl font-semibold leading-none ${color}`}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}