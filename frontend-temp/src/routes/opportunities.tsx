import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Trials & Opportunities — Sportzzbook" },
      {
        name: "description",
        content: "Cricket trials, football academy selections and inter-college athletics meets you can apply to.",
      },
      { property: "og:title", content: "Trials & Opportunities — Sportzzbook" },
      { property: "og:description", content: "Trials, camps and inter-college meets open for applications." },
    ],
  }),
  component: Opportunities,
});

function Opportunities() {
  const { isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState("All");
  const [active, setActive] = useState<any | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await api.get("/opportunities");
        setOpportunities(res.data);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunities();
  }, []);

  const sports = ["All", ...Array.from(new Set(opportunities.map((o) => o.sport)))];
  const list = opportunities.filter((o) => sport === "All" || o.sport === sport);

  function handleApplyClick(o: any) {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setActive(o);
  }

  return (
    <>
      <p className="eyebrow">Opportunities</p>
      <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Trials & events</h1>

      <div className="mt-5 flex flex-wrap gap-1.5">
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
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="panel mt-5 p-6 text-center text-sm text-muted-foreground">Loading opportunities…</p>
      ) : (
        <div className="mt-5 space-y-3">
          {list.map((o) => (
            <article key={o._id} className="panel p-4">
              <div className="flex items-start gap-4">
                <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary py-2.5 ring-1 ring-border">
                  <span className="font-display text-xl font-bold leading-none text-foreground">{o.day}</span>
                  <span className="text-[11px] font-medium text-muted-foreground">{o.month}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-base font-bold">{o.title}</h2>
                  <p className="truncate text-sm text-muted-foreground">
                    {o.org} · 📍 {o.city}
                  </p>
                  <p className="mt-2 text-sm text-foreground/80">{o.details}</p>
                </div>
                <button
                  onClick={() => handleApplyClick(o)}
                  disabled={appliedIds.has(o._id)}
                  className="shrink-0 self-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:bg-secondary disabled:text-muted-foreground disabled:hover:translate-y-0"
                >
                  {appliedIds.has(o._id) ? "Applied ✓" : "Apply"}
                </button>
              </div>
            </article>
          ))}

          {list.length === 0 ? (
            <p className="panel p-6 text-center text-sm text-muted-foreground">No opportunities for that sport yet.</p>
          ) : null}
        </div>
      )}

      {showLoginPrompt ? <LoginPromptModal onClose={() => setShowLoginPrompt(false)} /> : null}

      {active ? (
        <ApplyModal
          opportunity={active}
          onClose={() => setActive(null)}
          onApplied={(id) => setAppliedIds((prev) => new Set(prev).add(id))}
        />
      ) : null}
    </>
  );
}

function LoginPromptModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-5 backdrop-blur-sm">
      <div className="panel w-full max-w-sm p-6 text-center">
        <p className="text-3xl">🔒</p>
        <h2 className="mt-2 font-display text-lg font-bold">Please login to apply</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You need a Sportzzbook account to apply to trials and opportunities.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <Link
            to="/login"
            onClick={onClose}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

function ApplyModal({
  opportunity, onClose, onApplied,
}: { opportunity: any; onClose: () => void; onApplied: (id: string) => void }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/apply", { opportunityId: opportunity._id });
      onApplied(opportunity._id);
      setDone(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-5 backdrop-blur-sm">
      <div className="panel w-full max-w-md p-6">
        {done ? (
          <div className="text-center">
            <p className="text-3xl">🎉</p>
            <h2 className="mt-2 font-display text-lg font-bold">Application sent</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {opportunity.org} will contact you about {opportunity.title} on {opportunity.date}.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="eyebrow">Apply</p>
            <h2 className="mt-1 font-display text-lg font-bold">{opportunity.title}</h2>
            <p className="text-sm text-muted-foreground">
              {opportunity.org} · {opportunity.date}
            </p>

            <div className="mt-5 space-y-3">
              <Field label="Full name" placeholder="Rahul Sharma" />
              <Field label="Email" placeholder="you@example.com" type="email" />
              <Field label="Sport & position" placeholder="Cricket · Right-hand batsman" />
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Why should they pick you?</span>
                <textarea
                  rows={3}
                  placeholder="Recent results, training, availability…"
                  className="mt-1 w-full resize-none rounded-xl bg-secondary px-3 py-2 text-sm outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-primary"
                />
              </label>
            </div>

            {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        required
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl bg-secondary px-3 py-2 text-sm outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-primary"
      />
    </label>
  );
}