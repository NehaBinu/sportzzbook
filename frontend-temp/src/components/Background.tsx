export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute -top-40 -right-32 size-[520px] rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute top-1/3 -left-40 size-[520px] rounded-full bg-foreground/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 size-[420px] rounded-full bg-foreground/5 blur-3xl" />
    </div>
  );
}
