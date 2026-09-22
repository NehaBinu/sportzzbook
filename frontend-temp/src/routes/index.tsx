import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { PostCard } from "@/components/PostCard";
import footballImg from "@/assets/football.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sportzzbook Feed — Achievements from the sports community" },
      {
        name: "description",
        content:
          "See what athletes, coaches and academies are achieving today: medals, match results and open team spots.",
      },
      { property: "og:title", content: "Sportzzbook Feed — Achievements from the sports community" },
      {
        property: "og:description",
        content: "Medals, match results and open team spots from athletes near you.",
      },
    ],
  }),
  component: Feed,
});

const AVATAR_MAP: Record<string, string> = {
  "Rahul Sharma": "/src/assets/athlete-rahul.jpg",
  "Arjun Mehta": "/src/assets/athlete-arjun.jpg",
  "Sana Qureshi": "/src/assets/athlete-sana.jpg",
  "Neha Kapoor": "/src/assets/athlete-neha.jpg",
  "Imran Khan": "/src/assets/coach-imran.jpg",
};

function useMockLiveScore() {
  const [score, setScore] = useState({ home: 1, away: 1, minute: 62 });

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        const roll = Math.random();
        if (roll < 0.15) return { ...prev, home: prev.home + 1, minute: Math.min(prev.minute + 1, 90) };
        if (roll < 0.25) return { ...prev, away: prev.away + 1, minute: Math.min(prev.minute + 1, 90) };
        return { ...prev, minute: Math.min(prev.minute + 1, 90) };
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return score;
}

function Feed() {
  const [people, setPeople] = useState<any[]>([]);
  const [academies, setAcademies] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const score = useMockLiveScore();

  useEffect(() => {
    async function fetchAll() {
      try {
        const [peopleRes, academiesRes, opportunitiesRes, postsRes] = await Promise.all([
          api.get("/users"),
          api.get("/academies"),
          api.get("/opportunities"),
          api.get("/posts"),
        ]);
        setPeople(peopleRes.data);
        setAcademies(academiesRes.data);
        setOpportunities(opportunitiesRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Failed to load feed data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return <p className="panel p-6 text-center text-sm text-muted-foreground">Loading feed…</p>;
  }

  const featured = people.find((p) => p.name === "Rahul Sharma") || people[0];

  return (
    <>
      <section className="panel relative mb-7 overflow-hidden">
        <img
          src={footballImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />

        <div className="relative flex flex-wrap items-center gap-x-8 gap-y-4 px-6 py-6">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              Live · District Sports Meet
            </p>
            <h1 className="mt-1 font-display text-2xl font-medium leading-none tracking-tight sm:text-3xl">
              Matchday board
            </h1>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-background/70 px-4 py-3 ring-1 ring-border backdrop-blur-sm">
            <span className="text-sm font-medium text-muted-foreground">Udaipur XI</span>
            <span className="font-display text-2xl font-bold">{score.home}</span>
            <span className="text-muted-foreground">–</span>
            <span className="font-display text-2xl font-bold">{score.away}</span>
            <span className="text-sm font-medium text-muted-foreground">Jaipur FC</span>
            <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-400 ring-1 ring-red-500/30">
              {score.minute}'
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Stat value={String(people.length)} label="Athletes" />
            <Stat value={String(academies.length)} label="Academies" tone="accent" />
            <Stat value={String(opportunities.length)} label="Opportunities" tone="primary" />
          </div>
        </div>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {featured ? (
            <article className="panel overflow-hidden transition-transform hover:-translate-y-1">
              <div className="flex gap-4 p-5">
                <img
                  src={AVATAR_MAP[featured.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(featured.name)}&background=random`}
                  alt={featured.name}
                  width={512}
                  height={512}
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-display text-lg font-medium tracking-tight">{featured.name}</h2>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent ring-1 ring-accent/25">
                      {featured.sport}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    📍 {featured.city} {featured.college ? `· 🎓 ${featured.college}` : ""}
                  </p>
                </div>
                <Link
                  to="/profile/$personId"
                  params={{ personId: featured._id }}
                  className="shrink-0 self-start rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
                >
                  View
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-px bg-border">
                <StatStrip value={featured.stats?.achievements ?? 0} label="Achievements" width="80%" bar="bg-foreground/70" />
                <StatStrip value={featured.stats?.matches ?? 0} label="Matches" width="60%" bar="bg-accent/80" />
                <StatStrip value={featured.stats?.awards ?? 0} label="Awards" width="35%" bar="bg-primary/80" />
              </div>

              <div className="border-t border-border bg-background/30 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow">Sports Resume</p>
                  {featured.contact ? (
                    <a
                      href={`mailto:${featured.contact}`}
                      className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Contact
                    </a>
                  ) : null}
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {(featured.resume || []).map((r: any) => (
                    <li key={r.title} className="flex items-center gap-2 text-foreground/85">
                      <span>{r.medal === "gold" ? "🥇" : r.medal === "silver" ? "🥈" : "🏆"}</span>
                      {r.title} — {r.year}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(featured.skills || []).map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ) : null}

          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        <aside className="space-y-5">
          <section className="panel p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">Explore</p>
              <Link to="/explore" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                See all
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {people.filter((p) => p._id !== featured?._id).slice(0, 3).map((p) => (
                <div key={p._id} className="rounded-xl bg-secondary p-3 ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <img
                      src={AVATAR_MAP[p.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`}
                      alt={p.name}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="size-9 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.role === "Coach" ? `${p.sport} coach` : p.sport} · {p.city}
                      </p>
                    </div>
                    <Link
                      to="/profile/$personId"
                      params={{ personId: p._id }}
                      className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">Academies</p>
              <Link to="/academies" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                See all
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {academies.slice(0, 2).map((a) => (
                <Link
                  key={a._id}
                  to="/academies/$academyId"
                  params={{ academyId: a._id }}
                  className="block rounded-xl bg-secondary p-3 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                >
                  <p className="text-sm font-medium">{a.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">📍 {a.city}</p>
                    <p className="text-xs font-medium text-primary">★ {a.rating}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">Opportunities</p>
              <Link to="/opportunities" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                See all
              </Link>
            </div>
            <div className="mt-4 space-y-2.5">
              {opportunities.slice(0, 3).map((o) => (
                <div key={o._id} className="flex items-stretch gap-3">
                  <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary py-2 ring-1 ring-border">
                    <span className="font-display text-lg font-semibold leading-none">{o.day}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{o.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{o.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.org}</p>
                  </div>
                  <Link
                    to="/opportunities"
                    className="shrink-0 self-center rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
                  >
                    Apply
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: "accent" | "primary" }) {
  const color = tone === "accent" ? "text-accent" : tone === "primary" ? "text-primary" : "text-foreground";
  return (
    <div className="min-w-[104px] rounded-xl bg-background/70 px-4 py-3 ring-1 ring-border backdrop-blur-sm">
      <p className={`font-display text-2xl font-semibold leading-none ${color}`}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function StatStrip({
  value, label, width, bar,
}: { value: number; label: string; width: string; bar: string }) {
  return (
    <div className="bg-background/40 px-4 py-3">
      <p className="font-display text-xl font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div className={`stat-fill h-full rounded-full ${bar}`} style={{ ["--w" as string]: width }} />
      </div>
    </div>
  );
}