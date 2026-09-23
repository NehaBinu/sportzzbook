import { Link } from "@tanstack/react-router";
import { useStore, toggleLike, addComment } from "@/lib/store";
import { useState } from "react";
import rahulImg from "@/assets/athlete-rahul.jpg";
import arjunImg from "@/assets/athlete-arjun.jpg";
import sanaImg from "@/assets/athlete-sana.jpg";
import nehaImg from "@/assets/athlete-neha.jpg";
import imranImg from "@/assets/coach-imran.jpg";

// Fixed: these now point at real imported (bundled) images instead of raw
// "/src/assets/..." string paths, which only worked by accident in dev mode
// and broke once Vite built/hashed the assets for production.
const AVATAR_MAP: Record<string, string> = {
  "Rahul Sharma": rahulImg,
  "Arjun Mehta": arjunImg,
  "Sana Qureshi": sanaImg,
  "Neha Kapoor": nehaImg,
  "Imran Khan": imranImg,
};

// Fallback images by sport, used when a post has no image of its own.
const SPORT_FALLBACK_MAP: Record<string, string> = {
  Cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop",
  Football: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1200&auto=format&fit=crop",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
  Athletics: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
};

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop";

// Used only if every remote image fails to load — guaranteed to render.
const SAFE_PLACEHOLDER =
  "https://ui-avatars.com/api/?name=Sportzzbook&background=0f2a1f&color=fff&size=512";

// Only these authors show a post image; everyone else renders as a text-only post.
const AUTHORS_WITH_IMAGE = new Set(["Arjun Mehta", "Sana Qureshi"]);

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PostCard({ post }: { post: any }) {
  const { liked, comments } = useStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const author = post.author;
  const isLiked = !!liked[post._id];
  const extra = comments[post._id] ?? [];

  const baseLikes = post.likes?.length ?? 0;
  const baseComments = post.comments?.length ?? 0;

  const showImage = AUTHORS_WITH_IMAGE.has(author?.name);

  const imageUrl =
    post.image ||
    SPORT_FALLBACK_MAP[author?.sport as string] ||
    DEFAULT_FALLBACK;

  return (
    <article className="group overflow-hidden rounded-2xl bg-[#0f2a1f]/60 backdrop-blur-md border border-white/5 shadow-lg hover:shadow-xl transition-all">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={
            AVATAR_MAP[author?.name] ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              author?.name || "User"
            )}`
          }
          alt={author?.name || "User avatar"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = SAFE_PLACEHOLDER;
          }}
          className="size-10 rounded-full object-cover ring-2 ring-green-400/30"
        />

        <div className="flex-1">
          <p className="text-sm font-semibold">
            <Link
              to="/profile/$personId"
              params={{ personId: author?._id }}
              className="hover:text-green-400"
            >
              {author?.name || "Sportzzbook"}
            </Link>
            <span className="text-xs text-muted-foreground ml-2">
              · {author?.sport}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {timeAgo(post.createdAt)} {author?.city && `· ${author.city}`}
          </p>
        </div>
      </div>

      {/* IMAGE + GRADIENT (only for selected authors) */}
      {showImage && (
        <div className="relative">
          <img
            src={imageUrl}
            alt={post.text || `${author?.name || "Sportzzbook"} post`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = SAFE_PLACEHOLDER;
            }}
            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4">
        <p className="text-sm font-semibold">
          {baseLikes + (isLiked ? 1 : 0)} likes
        </p>

        <p className="mt-2 text-[15px] leading-relaxed text-white/90">
          <span className="font-semibold">
            {author?.name || "Sportzzbook"}
          </span>{" "}
          {post.text}
        </p>

        {baseComments + extra.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-2 text-sm text-gray-400 hover:text-white"
          >
            View all {baseComments + extra.length} comments
          </button>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center gap-6 px-4 pb-4 text-sm">
        <button
          onClick={() => toggleLike(post._id)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`size-5 transition-all duration-200 ${
              isLiked ? "scale-110" : "scale-100"
            }`}
            fill={isLiked ? "#f87171" : "none"}
            stroke={isLiked ? "#f87171" : "currentColor"}
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
          <span>{baseLikes + (isLiked ? 1 : 0)}</span>
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-gray-400 hover:text-white"
        >
          💬 {baseComments + extra.length}
        </button>

        <button className="text-gray-400 hover:text-white">
          ↗ Share
        </button>
      </div>

      {/* COMMENTS */}
      {open && (
        <div className="border-t border-white/10 p-4">
          {extra.length > 0 && (
            <ul className="mb-3 space-y-2">
              {extra.map((c, i) => (
                <li key={i} className="bg-white/5 px-3 py-2 rounded-lg text-sm">
                  {c}
                </li>
              ))}
            </ul>
          )}

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              addComment(post._id, draft.trim());
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm outline-none border border-white/10"
            />
            <button className="bg-green-500 px-3 py-2 rounded-lg text-sm font-semibold text-black">
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
