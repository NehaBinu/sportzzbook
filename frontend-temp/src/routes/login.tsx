import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in or Register — Sportzzbook" },
      {
        name: "description",
        content: "Create your Sportzzbook account as an athlete, coach or academy and start building your profile.",
      },
      { property: "og:title", content: "Sign in or Register — Sportzzbook" },
      { property: "og:description", content: "Join as an athlete, coach or academy." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState("Athlete");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ name, email, password, role });
      }
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
        {mode === "login" ? "Sign in to Sportzzbook" : "Create your account"}
      </h1>

      <div className="panel mt-5 p-6">
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1 ring-1 ring-border">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <Field label="Full name" placeholder="Rahul Sharma" value={name} onChange={setName} />
              <div>
                <span className="text-xs font-medium text-muted-foreground">I am a…</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Athlete", "Coach"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        role === r
                          ? "bg-accent font-semibold text-accent-foreground"
                          : "bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          <Field label="Email" placeholder="you@example.com" type="email" value={email} onChange={setEmail} />
          <Field label="Password" placeholder="••••••••" type="password" value={password} onChange={setPassword} />

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, placeholder, type = "text", value, onChange,
}: { label: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-sm outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-primary"
      />
    </label>
  );
}