import { Link } from "@tanstack/react-router";
import logo_new from "@/assets/logo_new.png";

export function Footer() {
  return (
    <footer className="hidden border-t border-border md:block">
      <div className="mx-auto max-w-[1240px] px-5 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <img src={logo_new} alt="Sportzzbook" className="size-7 rounded-lg object-cover" />
              <span className="font-display text-base font-bold tracking-tight">
                Sportzz<span className="text-accent">book</span>
              </span>
            </div>
            <p className="mt-3 max-w-[220px] text-sm text-muted-foreground">
              Built for athletes who'd rather be training than filling out forms.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { label: "Explore", to: "/explore" },
              { label: "Academies", to: "/academies" },
              { label: "Opportunities", to: "/opportunities" },
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              { label: "About", to: "#" },
              { label: "Contact", to: "#" },
            ]}
          />

          <FooterColumn
            title="Legal"
            links={[
              { label: "Terms", to: "#" },
              { label: "Privacy", to: "#" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 Sportzzbook. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Instagram</a>
            <a href="#" className="transition-colors hover:text-foreground">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            {l.to.startsWith("/") ? (
              <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ) : (
              <a href={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}