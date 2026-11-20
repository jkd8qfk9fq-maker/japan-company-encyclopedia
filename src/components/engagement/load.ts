"use client";

import type { ConnectionsData, QuizQuestion, UpdatesData } from "@/lib/engagement-data";
import type { LearnStep } from "@/lib/learn-course";

// Not imported from lib/site: that module resolves SITE_URL, which only the server has.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const cache = new Map<string, Promise<unknown>>();

/** A build-time JSON file, fetched once per page load and shared by every component that asks (JCE-052). */
function load<T>(path: string): Promise<T> {
  let p = cache.get(path) as Promise<T> | undefined;
  if (!p) {
    p = fetch(`${BASE_PATH}${path}`)
      .then((r) => (r.ok ? (r.json() as Promise<T>) : Promise.reject(new Error(String(r.status)))))
      .catch((error) => {
        cache.delete(path); // a later visit may retry
        throw error;
      });
    cache.set(path, p);
  }
  return p;
}

export const loadConnections = () => load<ConnectionsData>("/connections.json");
export const loadUpdates = () => load<UpdatesData>("/updates.json");
export const loadQuiz = () => load<QuizQuestion[]>("/quiz.json");
export const loadLearn = () => load<LearnStep[]>("/learn.json");
