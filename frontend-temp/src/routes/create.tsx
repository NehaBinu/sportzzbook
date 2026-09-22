import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SPORTS } from "@/data/sportzzbook";
import { addPost } from "@/lib/store";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Post — Sportzzbook" },
      {
        name: "description",
        content: "Share a win, a medal or a team opening with the Sportzzbook community in a few seconds.",
      },
      { property: "og:title", content: "Create a Post — Sportzzbook" },
      { property: "og:description", content: "Share a win, a medal or a team opening with the community." },
    ],
  }),
  component: CreatePost,
});

const BADGES = ["🥇 Gold medal", "🏆 Tournament win", "🎯 Personal best", "⚽ Looking for a team", "📣 Announcement"];

function CreatePost() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [sport, setSport] = useState<string>(SPORTS[0]);
  const [badge, setBadge] = useState<string | null>(null);
  const [media, setMedia] = useState<{ name: string; url: string } | null>(null);
  const [city, setCity] = useState("Delhi");

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Create post</p>
      <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Share an achievement</h1>

      <form
        className="panel mt-5 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addPost({
            id: `new-${Date.now()}`,
            authorId: "rahul-sharma",
            timeAgo: "Just now",
            city,
            text: text.trim(),
            image: media?.url,
            likes: 0,
            comments: 0,
            badge: badge ?? undefined,
          });
          navigate({ to: "/" });
        }}
      >
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">What happened?</span>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Won 1st place in the District Cricket Tournament…"
            className="mt-1 w-full resize-none rounded-xl bg-secondary px-3 py-2.5 text-sm outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-primary"
          />
        </label>

        <div className="mt-4">
          <span className="text-xs font-medium text-muted-foreground">Photo or video</span>
          <label className="mt-1 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-secondary px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setMedia({ name: file.name, url: URL.createObjectURL(file) });
              }}
            />
            {media ? `📎 ${media.name}` : "📸 Tap to add a photo or video"}
          </label>
          {media?.url ? (
            <img src={media.url} alt="" className="mt-3 aspect-video w-full rounded-xl object-cover" />
          ) : null}
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-muted-foreground">Sport tag</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SPORTS.map((s) => (
              <button
                key={s}
                type="button"
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
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-muted-foreground">Achievement badge</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {BADGES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBadge(badge === b ? null : b)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                   badge === b
                     ? "bg-accent font-semibold text-accent-foreground"
                    : "bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-medium text-muted-foreground">City</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-xl bg-secondary px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-primary"
          />
        </label>

        <button
          disabled={!text.trim()}
          className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:bg-secondary disabled:text-muted-foreground disabled:hover:translate-y-0"
        >
          Publish to feed
        </button>
      </form>
    </div>
  );
}
