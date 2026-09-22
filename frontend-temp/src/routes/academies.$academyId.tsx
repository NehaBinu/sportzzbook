import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ACADEMIES, OPPORTUNITIES } from "@/data/sportzzbook";

export const Route = createFileRoute("/academies/$academyId")({
  loader: ({ params }) => {
    const academy = ACADEMIES.find((a) => a.id === params.academyId);
    if (!academy) throw notFound();
    return { academy };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Academy unavailable — Sportzzbook" }, { name: "robots", content: "noindex" }] };
    }
    const { academy } = loaderData;
    const description = `${academy.name} in ${academy.city}: ${academy.sport} coaching, ${academy.coaches} coaches and open trials.`;
    return {
      meta: [
        { title: `${academy.name} — Sportzzbook` },
        { name: "description", content: description },
        { property: "og:title", content: `${academy.name} — Sportzzbook` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AcademyDetail,
});

function AcademyDetail() {
  const { academy } = Route.useLoaderData();
  const trials = OPPORTUNITIES.filter((o) => o.org === academy.name || o.sport === academy.sport);

  return (
    <>
      <Link to="/academies" className="text-xs font-medium text-muted-foreground hover:text-foreground">
        ← All academies
      </Link>

      <section className="panel mt-4 p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
             <span className="grid size-14 shrink-0 place-items-center rounded-sm bg-accent font-display text-xl font-bold text-accent-foreground">
              {academy.name.charAt(0)}
            </span>
            <div className="min-w-0">
               <h1 className="truncate font-display text-xl font-bold sm:text-2xl">{academy.name}</h1>
              <p className="truncate text-sm text-muted-foreground">
                {academy.sport} · 📍 {academy.city}
              </p>
            </div>
          </div>
           <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-border">
            ★ {academy.rating}
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-foreground/85">{academy.about}</p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Box value={academy.coaches} label="Coaches" />
          <Box value={academy.students} label="Students" />
          <Box value={trials.length} label="Open trials" />
        </div>
      </section>

      <section className="panel mt-5 p-5">
        <p className="eyebrow">Trials at this academy</p>
        <div className="mt-4 space-y-2.5">
          {trials.map((o) => (
            <div key={o.id} className="flex items-center gap-3 rounded-xl bg-secondary p-3 ring-1 ring-border">
              <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-background/60 py-1.5 ring-1 ring-border">
                <span className="font-display text-base font-semibold leading-none">{o.day}</span>
                 <span className="text-[11px] font-medium text-muted-foreground">{o.month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{o.title}</p>
                <p className="truncate text-xs text-muted-foreground">{o.date}</p>
              </div>
              <Link
                to="/opportunities"
                className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
              >
                Apply
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-background/50 px-4 py-3 ring-1 ring-border">
      <p className="font-display text-xl font-semibold leading-none">{value}</p>
       <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
