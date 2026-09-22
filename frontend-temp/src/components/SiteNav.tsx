import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import logo_new from "@/assets/logo_new.png";

const NAV = [
  { to: "/", label: "Feed", icon: "🏠", exact: true },
  { to: "/explore", label: "Explore", icon: "🔎", exact: false },
  { to: "/academies", label: "Academies", icon: "🏫", exact: false },
  { to: "/opportunities", label: "Opportunities", icon: "🏆", exact: false },
  { to: "/create", label: "Post", icon: "➕", exact: false },
] as const;

export function SiteHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-[1240px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logo_new}
            alt="Sportzzbook"
            className="size-9 shrink-0 rounded-lg object-cover"
          />
          <span className="truncate font-display text-xl font-bold tracking-tight">
            Sportzz<span className="text-accent">book</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.slice(0, 4).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
               activeProps={{ className: "border-primary text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
               className="border-b-2 border-transparent px-3 py-5 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2.5">
          <Link
            to="/explore"
            className="hidden items-center gap-2 rounded-xl bg-secondary px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground lg:flex"
          >
            <span>⌕</span>
            <span>Search athletes, academies…</span>
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span
                title={user.name}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-display text-xs font-bold text-accent-foreground"
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <button
                onClick={logout}
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground sm:block"
            >
              Sign in
            </Link>
          )}

          <Link
            to="/create"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Post
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-[560px] grid-cols-5">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
             activeProps={{ className: "border-primary text-foreground" }}
            inactiveProps={{ className: "text-muted-foreground" }}
             className="border-t-2 border-transparent px-1 py-2 text-[11px] font-medium transition-colors"
          >
             <span className="flex flex-col items-center gap-0.5">
               <span className="text-base leading-none">{item.icon}</span>
               <span className="truncate">{item.label}</span>
             </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}