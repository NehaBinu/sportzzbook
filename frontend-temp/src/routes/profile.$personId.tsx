import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MEDAL_ICON, PEOPLE, getPerson } from "@/data/sportzzbook";
import { useStore } from "@/lib/store";
import { PostCard } from "@/components/PostCard";

export const Route = createFileRoute("/profile/$personId")({
  loader: ({ params }) => {
    const person = getPerson(params.personId);
    if (!person) throw notFound();
    return { person };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Profile unavailable — Sportzzbook" }, { name: "robots", content: "noindex" }] };
    }
    const { person } = loaderData;
    const description = `${person.name} — ${person.sport} ${person.role.toLowerCase()} from ${person.city}. ${person.stats.achievements} achievements, ${person.stats.awards} awards.`;
    return {
      meta: [
        { title: `${person.name} — ${person.sport} ${person.role} | Sportzzbook` },
        { name: "description", content: description },
        { property: "og:title", content: `${person.name} — ${person.sport} ${person.role}` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Profile,
});

function Profile() {
  const { person } = Route.useLoaderData();
  const { posts } = useStore();
  const own = posts.filter((p) => p.authorId === person.id);
  const similar = PEOPLE.filter((p) => p.id !== person.id && p.sport === person.sport).slice(0, 3);

  return (
    <>
      <Link to="/explore" className="text-xs font-medium text-muted-foreground hover:text-foreground">
        ← Back to explore
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <section className="panel overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-5 sm:flex sm:items-center">
              <div className="flex min-w-0 items-center gap-4">
                <img
                  src={person.avatar}
                  alt={person.name}
                  width={512}
                  height={512}
                  className="size-20 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                   <h1 className="truncate font-display text-xl font-bold sm:text-2xl">
                    {person.name}
                  </h1>
                  <p className="truncate text-sm text-muted-foreground">
                    {person.sport} · {person.position}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    📍 {person.city}
                    {person.college ? ` · 🎓 ${person.college}` : ""}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent ring-1 ring-accent/25 sm:ml-auto">
                {person.role}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-px bg-border">
              <Strip value={person.stats.achievements} label="Achievements" />
              <Strip value={person.stats.matches} label="Matches" />
              <Strip value={person.stats.awards} label="Awards" />
            </div>

            <p className="border-t border-border p-5 text-sm leading-relaxed text-foreground/85">{person.about}</p>
          </section>

          <section className="panel p-5">
            <p className="eyebrow">Sports Resume</p>
            <ul className="mt-4 space-y-3">
              {person.resume.map((r) => (
                <li key={r.title} className="flex items-start gap-3 rounded-xl bg-secondary p-3 ring-1 ring-border">
                  <span className="text-lg leading-none">{MEDAL_ICON[r.medal]}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.year}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-5">Skills</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {person.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border"
                >
                  {s}
                </span>
              ))}
            </div>

            <a
              href={`mailto:${person.contact}`}
              className="mt-5 block rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              📩 Contact {person.name.split(" ")[0]}
            </a>
          </section>

          {own.length > 0 ? (
            <section className="space-y-4">
              <p className="eyebrow">Recent posts</p>
              {own.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </section>
          ) : null}
        </div>

        <aside className="space-y-5">
          <section className="panel p-5">
            <p className="eyebrow">Also in {person.sport}</p>
            <div className="mt-4 space-y-2">
              {similar.length === 0 ? (
                <p className="text-sm text-muted-foreground">No one else listed yet.</p>
              ) : (
                similar.map((p) => (
                  <Link
                    key={p.id}
                    to="/profile/$personId"
                    params={{ personId: p.id }}
                    className="flex items-center gap-3 rounded-xl bg-secondary p-3 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="size-9 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.role} · {p.city}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function Strip({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-background/40 px-4 py-3">
      <p className="font-display text-xl font-semibold leading-none">{value}</p>
       <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
