import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import { SPORTS } from "@/data/sportzzbook";
import rahulImg from "@/assets/athlete-rahul.jpg";
import arjunImg from "@/assets/athlete-arjun.jpg";
import sanaImg from "@/assets/athlete-sana.jpg";
import nehaImg from "@/assets/athlete-neha.jpg";
import imranImg from "@/assets/coach-imran.jpg";

const AVATAR_MAP: Record<string, string> = {
  "Rahul Sharma": rahulImg,
  "Arjun Mehta": arjunImg,
  "Sana Qureshi": sanaImg,
  "Neha Kapoor": nehaImg,
  "Imran Khan": imranImg,
};

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Athletes, Coaches & Academies — Sportzzbook" },
      {
        name: "description",
        content: "Search players, coaches and sports academies by sport and city, and open their full profiles.",
      },
      { property: "og:title", content: "Explore Athletes, Coaches & Academies — Sportzzbook" },
      { property: "og:description", content: "Search players, coaches and academies by sport and city." },
    ],
  }),
  component: Explore,
});

const TABS = ["Athletes", "Coaches", "Academies"] as const;

function Explore() {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Athletes");

  const [people, setPeople] = useState<any[]>([]);
  const [academies, setAcademies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [peopleRes, academiesRes] = await Promise.all([
          api.get("/users"),
          api.get("/academies"),
        ]);
        setPeople(peopleRes.data);
        setAcademies(academiesRes.data);
      } catch (err) {
        console.error("Failed to load explore data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cities = useMemo(
    () => ["All", ...Array.from(new Set([...people.map((p) => p.city), ...academies.map((a) => a.city)]))],
    [people, academies],
  );

  const q = query.trim().toLowerCase();
  const matches = (text: string) => !q || (text || "").toLowerCase().includes(q);

  const filteredPeople = people.filter(
    (p) =>
      p.role === (tab === "Coaches" ? "Coach" : "Athlete") &&
      (sport === "All" || p.sport === sport) &&
      (city === "All" || p.city === city) &&
      (matches(p.name) || matches(p.sport) || matches(p.city)),
  );

  const filteredAcademies = academies.filter(
    (a) =>
      (sport === "All" || a.sport === sport) &&
      (city === "All" || a.city === city) &&
      (matches(a.name) || matches(a.sport) || matches(a.city)),
  );

  return (
    <>
      <p className="eyebrow">Explore</p>
      <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Find players & coaches</h1>

      <section className="panel mt-5 p-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, sport or city…"
          className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-primary"
        />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {["All", ...SPORTS].map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                sport === s
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                city === c
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground"
              }`}
            >
              📍 {c}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-5 flex gap-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-secondary text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="panel mt-4 p-6 text-center text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className={`mt-4 ${tab === "Academies" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "divide-y divide-border border-y border-border"}`}>
          {tab !== "Academies" &&
            filteredPeople.map((p) => (
              <article key={p._id} className="flex items-center gap-4 py-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <img
                    src={AVATAR_MAP[p.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`}
                    alt={p.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.sport} · {p.city}
                    </p>
                  </div>
                </div>
                <p className="hidden max-w-sm flex-1 text-sm text-muted-foreground md:line-clamp-2">{p.about}</p>
                <Link
                  to="/profile/$personId"
                  params={{ personId: p._id }}
                  className="shrink-0 text-xs font-semibold text-foreground transition-colors hover:text-accent"
                >
                  View profile
                </Link>
              </article>
            ))}

          {tab === "Academies" &&
            filteredAcademies.map((a) => (
              <article key={a._id} className="panel p-4 transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-accent font-display text-lg font-bold text-accent-foreground">
                    {a.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.city} · ★ {a.rating}
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{a.about}</p>
                <Link
                  to="/academies/$academyId"
                  params={{ academyId: a._id }}
                  className="mt-3 inline-block rounded-xl bg-secondary px-3 py-2 text-xs font-semibold ring-1 ring-border transition-colors hover:text-primary"
                >
                  View academy
                </Link>
              </article>
            ))}

          {(tab === "Academies" ? filteredAcademies.length : filteredPeople.length) === 0 ? (
            <p className="panel p-6 text-center text-sm text-muted-foreground">
              Nothing matches those filters yet. Try another sport or city.
            </p>
          ) : null}
        </div>
      )}
    </>
  );
}