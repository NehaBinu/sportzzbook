import { useSyncExternalStore } from "react";
import { POSTS, type Post } from "@/data/sportzzbook";

type State = {
  posts: Post[];
  liked: Record<string, boolean>;
  applied: Record<string, boolean>;
  comments: Record<string, string[]>;
};

let state: State = {
  posts: POSTS,
  liked: {},
  applied: {},
  comments: {},
};

const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function toggleLike(postId: string) {
  const liked = { ...state.liked, [postId]: !state.liked[postId] };
  set({ liked });
}

export function addComment(postId: string, text: string) {
  const existing = state.comments[postId] ?? [];
  set({ comments: { ...state.comments, [postId]: [...existing, text] } });
}

export function apply(opportunityId: string) {
  set({ applied: { ...state.applied, [opportunityId]: true } });
}

export function addPost(post: Post) {
  set({ posts: [post, ...state.posts] });
}
